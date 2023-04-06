import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RandomStore } from './random.store';

const IMPORTS = [
  CommonModule,
  HttpClientModule,
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatProgressBarModule,
];

@Component({
  selector: 'jokes-random',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './random.component.html',
  providers: [RandomStore],
})
export class RandomComponent {
  constructor(
    protected readonly randomStore: RandomStore,
    private readonly snackbar: MatSnackBar
  ) {
    randomStore.fetchRandomJoke();
  }

  copyText(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackbar.open('Joke Copied to Clipboard!', 'HAHA', {
        duration: 1000,
      });
    });
  }
}
