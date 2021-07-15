import { MainPageService } from 'src/app/service/main-page/main-page.service';
import { MyNameService } from 'src/app/service/my-name/my-name.service';
import { ObjectChatThanhVien } from './../../../models/chat-page/chat-page-chat-page/header/object_chat_thanh_vien';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserVideo } from 'src/app/models/chat-page/call-video/user-video';

@Injectable({
  providedIn: 'root'
})
export class CallVideoService {

  // Request mediaDevices
  public mediaConstraints = {
    audio: true,
    video: true
  }

  // localStream
  public localStream: MediaStream;

  // is show component call video
  public is_show: boolean;

  // Trạng thái camera bật hay tắt
  public is_close_camera: boolean;
  // Trạng thái my camera go to left
  public is_camera_go_to_left: boolean;

  // All user
  public all_user: UserVideo[] = [];
  // user đang tương tác
  public now_user: ObjectChatThanhVien;
  // request 45s
  public countRequest = 0;

  // service
  public layAllUser: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private my_name_service: MyNameService,
    private main_page_service: MainPageService
  ) {
    if (this.layAllUser == null) {
      this.getData();
    } else {
      this.layAllUser.unsubscribe();
      this.getData();
    }
  }

  public getData() {
    this.layAllUser = this.db.object("/call_video").snapshotChanges().subscribe(data => {
      let array: UserVideo[] = [];
      Object.entries(data.payload.toJSON()).forEach(([k, v]) => {
        let o = new UserVideo();
        o.ma_tai_khoan = k;
        o.bat_may_chua = v['bat_may_chua'];
        o.goi_chua = v['goi_chua'];
        o.thoi_gian_goi = v['thoi_gian_goi'];
        o.thoi_gian_ket_thuc = v['thoi_gian_ket_thuc'];
        o.tk_goi_minh = v['tk_goi_minh'];
        o.hinh_tk_goi_minh = v['hinh_tk_goi_minh'];
        o.ten_tk_goi_minh = v['ten_tk_goi_minh'];
        array.push(o);
      });
      this.all_user = array;
    })
  }

  public async callVideo(tk: ObjectChatThanhVien) {
    this.now_user = tk;
    // Check thử available
    if (this.isAvailable(tk.ma_tai_khoan)) {
      // Lấy video
      this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
      this.is_show = true;
      // Cập nhật lại trong firebase
      this.writeToFirebase(tk);
      // Time out 45s
      this.countRequest = 0;
      this.request45second();
    } else {
      // Lấy video
      this.localStream = null;
      this.is_show = true;
    }
  }

  public request45second() {
    setTimeout(() => {
      this.countRequest++;
      if (this.countRequest <= 45) {
        let isOk = false;
        for (let i = 0; i < this.all_user.length; i++) {
          if (this.all_user[i].ma_tai_khoan == this.now_user.ma_tai_khoan) {
            if (this.all_user[i].bat_may_chua == 'roi') {
              isOk = true;
            }
            break;
          }
        }
        if (!isOk) {
          this.request45second();
        }
      } else {
        this.cuocGoiNho();
      }
    }, 1000);
  }

  public writeToFirebase(tk: ObjectChatThanhVien) {
    let currentTime = Number(new Date());
    let mtk = JSON.parse(localStorage.getItem("ma_tai_khoan_dn"));
    this.db.object("/call_video/" + tk.ma_tai_khoan).update({
      thoi_gian_goi: currentTime,
      goi_chua: "dang",
      bat_may_chua: "chua",
      tk_goi_minh: mtk,
      hinh_tk_goi_minh: this.main_page_service.img,
      ten_tk_goi_minh: this.my_name_service.myName
    });
    this.db.object("/call_video/" + mtk).update({
      thoi_gian_goi: currentTime,
      goi_chua: "dang",
      bat_may_chua: "roi",
      tk_goi_minh: 'khong_co',
      hinh_tk_goi_minh: 'khong_co',
      ten_tk_goi_minh: 'khong_co'
    });
  }

  public isAvailable(mtk: string): boolean {
    for (let i = 0; i < this.all_user.length; i++) {
      if (this.all_user[i].ma_tai_khoan == mtk) {
        if (this.all_user[i].goi_chua == 'dang') {
          return false;
        }
        break;
      }
    }
    return true;
  }

  public startVideo() {
    this.is_close_camera = false
    this.localStream.getTracks().forEach(function (track) {
      track.enabled = true;
    });
  }

  public offVideo() {
    this.is_close_camera = true;
    this.localStream.getTracks().forEach(function (track) {
      track.enabled = false;
    });
  }

  public close() {
    // countRequest
    this.countRequest = 45;
  }

  public cuocGoiNho() {
    // view
    this.is_show = false;
    this.localStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this.is_close_camera = false;
    // data
    this.closeData();
  }

  public closeData() {
    let mtk = JSON.parse(localStorage.getItem("ma_tai_khoan_dn"));
    this.db.object("/call_video/" + this.now_user.ma_tai_khoan).update({
      goi_chua: "chua",
    });
    this.db.object("/call_video/" + mtk).update({
      goi_chua: "chua",
    });
  }

  public cameraGoToLeft() {
    this.is_camera_go_to_left = !this.is_camera_go_to_left;
  }

}
