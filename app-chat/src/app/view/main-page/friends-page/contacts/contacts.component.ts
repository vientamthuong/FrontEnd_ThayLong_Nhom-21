import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  selectedUser:number = -1;
  change_slide: number = 0;
  prev: number = -1;
  next: number = -1;
  selectedGroupRequest:number = 0;
  slideStep:number = 4;


  public friends_list: any[] = [{
    id: '1',
    link: 'assets/images/list-friends-chat-page/avt1.jpg',
    name: 'Karlyn Carabello',
 
  },
  {
    id: '2',
    link: 'assets/images/list-friends-chat-page/avt2.jpg',
    name: 'Junior Sabine',
 
  },
  {
    id: '3',
    link: 'assets/images/list-friends-chat-page/avt3.jpg',
    name: 'Melinie Sherk',
   
  },
  {
    id: '4',
    link: 'assets/images/list-friends-chat-page/avt4.jpg',
    name: 'Harrison Palmatier',
  
  },
  {
    id: '5',
    link: 'assets/images/list-friends-chat-page/avt5.jpg',
    name: 'Tressa Duhart',

  },
  {
    id: '6',
    link: 'assets/images/list-friends-chat-page/avt6.jpg',
    name: 'Erick Spiva',
 
  },
  {
    id: '7',
    link: 'assets/images/list-friends-chat-page/avt7.png',
    name: 'Josefina Simpson',
   
  },
  {
    id: '8',
    link: 'assets/images/list-friends-chat-page/avt8.jpg',
    name: 'Yasuo Can 5',
  
  }
    ,
  {
    id: '9',
    link: 'assets/images/list-friends-chat-page/avt9.jpg',
    name: 'Kaisa Pentakill',
  
  }]
  constructor() { }

  ngOnInit(): void {
  }
  // index = 0 ? request selected : group selected
  onSelectedRequesAndGroup(index: number): void {
    this.selectedGroupRequest = index;
    this.selectedUser = -1;
    this.next = -1;
    this.prev = -1;
  }
  // chọn vào bạn bè thì tô màu background
 onSelected(index: number): void {
  if ((index - 1) >= 0 && (index + 1) < this.friends_list.length) {
    this.prev = index - 1;
    this.next = index + 1;
  } else if ((index - 1) >= 0) {
    this.prev = index - 1;
    this.next = -1;
  } else if ((index + 1) < this.friends_list.length) {
    this.prev = -1;
    this.next = index + 1;
  }
  // Cập nhập dữ liêu tại cha
  this.selectedGroupRequest = -1;
  this.selectedUser = index;
  
}
 
  getStyleShadowTop(): any {
    return {
      'height': this.selectedUser * 73 + 'px',
      'position': 'absolute',
      'width': '281px',
      'top': '0px',
      'left': '0px',
      'border-bottom-right-radius': '27px',
      'box-shadow': '4px 8px 28px 0px #d3dceb'
    };
  }
  // tạo chuyển động slide danh sách bạn đang onl
  changeSlide(change: number): void {
    this.change_slide = change;

  }
  //  Shadow bottom
  getStyleShadowBottom(): any {
    return {
      'height': (this.friends_list.length - this.selectedUser - 1) * 76 + 'px',
      'position': 'absolute',
      'width': '281px',
      'top': (this.selectedUser + 1) * 73 + 'px',
      'left': '0px',
      'border-top-right-radius': '27px',
      'box-shadow': '4px 8px 28px 0px #d3dceb'
    };
  }
   // set style tên cho tin nhắn chưa đọc
   getStyleNameReadMessage() {
    return {
      'font-weight': 'bold',
      'color': 'black',
      'font-size': '15px'
    };
  }
  // set style tin nhắn tóm tắt chưa đọc
  getStyleMessageReadMessage() {
    return {
      'font-weight': 'bold',
      'color': '#3275f7',
    };
  }
  // set style tin nhắn tóm tắt chưa đọc
  getStylePointReadMessage() {
    return {
      'position': 'absolute',
      'width': '10px',
      'height': '10px',
      'border-radius': '50%',
      'background-color': '#3275f7',
      'right': '9px',
      'top': '46.5px',
    }
  }
 
  getStyleTopHeader() {
    return { 
      'height':71 + 'px',
      'position': 'absolute',
      'width': '281px',
      'top': 0+ 'px',
      'left': '0px',
      'box-shadow': '0px 2px 28px 0px #d3dceb',
      'border-bottom-right-radius': '27px',
      'z-index':3
    }
  }
  getStyleBotHeader() {
    return {
      'height': 60 + 'px',
      'position': 'absolute',
      'width': '281px',
      'top': 70 + 'px',
      'left': '0px',
      'border-top-right-radius': '27px',
      'box-shadow': '0px -10px 15px 0px #e9ecf2',
      'z-index':3,

    };
  }
}