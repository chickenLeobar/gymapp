import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, iif } from 'rxjs';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { SedeService } from './sede.service';
import { ISede } from '..';
import producer from 'immer';
interface SedeState {
  sedes: ISede[];
}

@Injectable()
export class SedeStoreService extends ComponentStore<SedeState> {
  /*=============================================
  =            EFFECTS            =
  =============================================*/

  public getSedes = this.effect((source: Observable<{ id?: number }>) => {
    return source.pipe(
      switchMap(({ id }) =>
        this._sedeService.getSedes({ id }).pipe(
          tap((sedes: ISede[]) => {
            this.patchState({
              sedes: sedes
            });
          })
        )
      )
    );
  });

  //
  private createSedeOperator = (
    source: Observable<{ sede: Partial<ISede> }>
  ) => {
    return source.pipe(
      switchMap(({ sede }) =>
        iif(
          () => !sede.id,
          this._sedeService.createSede(sede),
          this._sedeService.updateSede(sede.id, sede)
        )
      ),
      tap((sede: ISede) => {
        this.addOrUpdateSede({ sede: sede });
      })
    );
  };

  public createSede = this.effect(
    (source: Observable<{ sede: Partial<ISede> }>) => {
      return source.pipe(this.createSedeOperator);
    }
  );

  public updateSede = this.effect(
    (source: Observable<{ sede: Partial<ISede> }>) => {
      return source.pipe(this.createSedeOperator);
    }
  );

  public deleteSede = this.effect((source: Observable<{ id: number }>) => {
    return source.pipe(
      switchMap(({ id }) => this._sedeService.deleteSede(id)),
      tap(data => {
        console.log('delete  sede');
        console.log(data);
      })
    );
  });

  constructor(private _sedeService: SedeService) {
    super({
      sedes: []
    });

    this.getSedes({});
  }

  /*=============================================
  =            updaters            =
  =============================================*/

  public addOrUpdateSede = this.updater((state, { sede }: { sede: ISede }) => {
    const newState = producer(state, draf => {
      const sedes = draf.sedes;
      let existSede = sedes.find(sede_ => sede_.id == sede.id);
      if (!existSede) {
        sedes.push(sede as NzSafeAny);
      } else {
        existSede = {
          ...existSede,
          ...sede
        };
      }
    });

    return {
      ...newState
    };
  });

  /*=============================================
  =            selectors            =
  =============================================*/

  public $sedes = this.select(state => state.sedes);

  /*=============================================
  =            view            =
  =============================================*/

  public vm$ = this.select(this.$sedes, sedes => {
    return {
      sedes
    };
  });
}
