import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HelperService } from '../helper.service';


interface SidenavItem {
  route: string;
  ico: string;
  title: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() appTitle;
  @Output() closeSidebar = new EventEmitter();

  isDesktop: boolean;
  isOpen = false;
  animate = false;
  sidenavItems: SidenavItem[];
  isDarkMode: Observable<boolean>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 767.98px)').pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private helperService: HelperService) {
    this.isDarkMode = helperService.getDarkModeState();
  }

  ngOnInit(): void {
    this.setDisplay();
    this.createMenu();
  }

  sideNavToggle() {
    this.animate = true;
    this.isOpen = !this.isOpen;
    localStorage.setItem('SidenavIsOpen', this.isOpen ? '1' : '0');
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event) {
    if (this.isOpen) {
      const target = event.target as HTMLElement;
      const isBackdropClick = target.classList.contains('js-backdrop');

      if (isBackdropClick) {
        this.isOpen = false;
      }
    }
  }

  handleDarkModeClick() {
    this.helperService.toggleDarkModeState();
    this.helperService.setDarkModeBodyClass();
  }

  setDisplay() {
    this.isHandset$.subscribe(isMobile => {
      if (isMobile) {
        this.isDesktop = false;
        this.isOpen = false;
      } else {
        this.isDesktop = true;
        this.isOpen = !!(+localStorage.getItem('SidenavIsOpen'));
      }
    });
  }

  createMenu() {
    this.sidenavItems = [
      {route: 'home', ico: 'sn-home', title: 'Home'},
      {route: 'day', ico: 'sn-day', title: 'Day'},
      {route: 'month', ico: 'sn-month', title: 'Month'},
      {route: 'year', ico: 'sn-year', title: 'Year'},
      {route: 'range', ico: 'sn-range', title: 'Range'},
    ];
  }
}
