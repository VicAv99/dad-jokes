import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CallState, getError, Joke, LoadingState } from '@jokes/models';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';

export interface RandomState {
  joke?: Joke;
  callState: CallState;
}

const defaultState: RandomState = {
  callState: LoadingState.INIT,
};

@Injectable()
export class RandomStore extends ComponentStore<RandomState> {
  constructor(private readonly http: HttpClient) {
    super(defaultState);
  }

  private readonly joke$ = this.select((state) => state.joke);

  private readonly loaded$: Observable<boolean> = this.select(
    (state) => state.callState === LoadingState.LOADED
  );

  private readonly loading$: Observable<boolean> = this.select(
    (state) => state.callState === LoadingState.LOADING
  );

  private readonly error$: Observable<string | null> = this.select((state) =>
    getError(state.callState)
  );

  readonly vm$ = this.select(
    this.joke$,
    this.loaded$,
    this.loading$,
    this.error$,
    (joke, loaded, loading, error) => ({
      joke,
      loaded,
      loading,
      error,
    })
  );

  readonly updateError = this.updater((state: RandomState, error: string) => {
    return {
      ...state,
      callState: {
        errorMsg: error,
      },
    };
  });

  readonly setLoading = this.updater((state: RandomState) => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  });

  readonly setLoaded = this.updater((state: RandomState) => {
    return {
      ...state,
      callState: LoadingState.LOADED,
    };
  });

  readonly updateJoke = this.updater((state: RandomState, joke: Joke) => {
    return {
      ...state,
      error: '',
      joke,
    };
  });

  readonly fetchRandomJoke = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.http
          .get<Joke>('https://icanhazdadjoke.com/', {
            headers: {
              Accept: 'application/json',
            },
          })
          .pipe(
            tapResponse(
              (joke) => {
                this.setLoaded();
                this.updateJoke(joke);
              },
              (e: string) => this.updateError(e)
            ),
            catchError(() => EMPTY)
          )
      )
    );
  });
}
