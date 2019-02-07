import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  form: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = fb.group({
      username: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    localStorage.removeItem('user');
  }

  createChatSession() {
    if (this.form.valid) {
      this.loading = true;
      const user: User = new User();
      user.Username = this.form.controls.username.value;
      this.authService.createUser(user).subscribe(
        (createdUser: User) => {
          console.log(createdUser);
          if (createdUser.Id) {
            localStorage.setItem('user', JSON.stringify(createdUser));
            this.router.navigate(['chat']);
          }
          this.loading = false;
        },
        error => {
          if (error.error.search(`(${user.Username})`) !== -1) {
            this.loading = false;
            return this.toastr.error('This username already exists.');
          }
          this.toastr.error('Error creating the user.');
          this.loading = false;
        }
      );
    }
  }
}
