import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from './services/login/login.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute, private titleService: Title,
    public loginService: LoginService) { }

  ngOnInit() {
    //Code from: https://www.c-sharpcorner.com/article/angular-dynamic-page-title-based-on-route/
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe((data: { title: string; }) => { this.titleService.setTitle(data.title) });
    });

    setTimeout(() => (document!.querySelector("df-messenger")!.shadowRoot!.querySelector("df-messenger-chat")!.shadowRoot!.querySelector("df-messenger-user-input")!.shadowRoot!.querySelector(".input-box-wrapper > input")! as HTMLInputElement).placeholder = "Овде укуцај питање за паметног агента...", 1000);
  }

  isDarkMode = true; /* Initially dark mode is on */

  onDarkModeChange(e: { checked: boolean; }) {
    this.isDarkMode = e.checked;
    document.querySelector("body")?.classList.remove(!e.checked ? "theme-dark" : "theme-light");
    document.querySelector("body")?.classList.add(e.checked ? "theme-dark" : "theme-light");
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  checkIfUserIsLoggedIn(): boolean {
    return sessionStorage.getItem("loggedInUser") != null;
  }
}