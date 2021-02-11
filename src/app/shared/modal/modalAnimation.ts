import { animate, group, state, style, transition, trigger } from '@angular/animations';

export const backdropAnimation = trigger('showHideBackdrop', [
  state('hide', style({
    display: 'none',
    opacity: 0,
  })),

  state('show', style({
    display: 'block',
    opacity: 0.7,
  })),

  transition('hide => show', [
    group([
      animate('0s', style({display: 'block'})),
      animate('250ms ease-in-out'),
    ])
  ]),

  transition('show => hide', [
    group([
      animate('250ms ease-in-out', style({opacity: 0})),
      animate('0s 250ms', style({display: 'none'})),
    ])
  ]),
]);

export const modalAnimation = trigger('openCloseModal', [
  state('close', style({
    display: 'none',
    opacity: 0,
    transform: 'scale(1.1)'
  })),

  state('open', style({
    display: 'flex',
    opacity: 1,
    transform: 'scale(1)'
  })),

  transition('close => open', [
    group([
      animate('0s', style({display: 'flex'})),
      animate('250ms 100ms ease-in-out'),
    ])
  ]),

  transition('open => close', [
    group([
      animate('250ms ease-in-out', style({opacity: 0, transform: 'scale(1.1)'})),
      animate('0s 250ms', style({display: 'none'})),
    ])
  ]),
]);
