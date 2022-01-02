import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import 'moment-duration-format';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  
export class AppComponent implements OnInit {
  
  title = 'VirTourMuseumPlaner';
  
  constructor(private router: Router,  
    private activatedRoute: ActivatedRoute,  
    private titleService: Title) { }

  ngOnInit() {
    //Code from: https://www.c-sharpcorner.com/article/angular-dynamic-page-title-based-on-route/
    /*this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe((data: { title: string; }) => { this.titleService.setTitle(data.title) });
    });*/
  }

  isDarkMode = true; /* Initially dark mode is on */
  
  onDarkModeChange(e: { checked: boolean; }) {
    this.isDarkMode = e.checked;
    document.querySelector("body")?.classList.remove(!e.checked ? "theme-dark" : "theme-light");
    document.querySelector("body")?.classList.add(e.checked ? "theme-dark" : "theme-light");
  }
}
