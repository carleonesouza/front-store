import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-base',
  template:'',
})
export class BaseComponent implements OnInit {

  private isAuth = false;
  constructor(private authService: AuthService,
    private router: Router) { }

   ngOnInit() {
     if(this.authService.check()){
      this.authService.check()
      .then((auth) =>{
        this.isAuth = auth;
        this.router.navigate(['/inicio']);
      })
      .catch((err)=>{
        console.log(err);
        this.authService.signOut();
      });
     }

  }

}
