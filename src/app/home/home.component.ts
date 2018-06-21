import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  temp;
  httpOptions;
  newMessage = { message: '' };
  messages: any;
  
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
      //set token in local storage
     this.httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    }; // get the info out of the web token
       this.temp = this.parseJwt(localStorage.getItem('jwtToken'));
        console.log(this.parseJwt(localStorage.getItem('jwtToken')));
        // load messages
        this.getMessages();
  }

  // get all messages
  getMessages() {
    this.http.get('/api/messages', this.httpOptions).subscribe(data => {
        this.messages = data;
        console.log("messages returned: " + JSON.stringify(this.messages));
      }, err => {
        if(err.status === 401) {
          this.router.navigate(['login']);
        }
      });
  }
  
  // gets the data out of token 
   parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }


  // save message
  submitMessage() {
    let completeMessage = {authorId: this.temp._id, authorName: this.temp.username, message: this.newMessage.message };
      console.log("message to send: " + JSON.stringify(completeMessage))
    this.http.post('/api/message', completeMessage, this.httpOptions)
      .subscribe(res => {
        console.log(res)
        }, (err) => {
          console.log(err);
        }
      );
  }
  
  // logout, remove web token
  logout() {// re route to login 
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

}
