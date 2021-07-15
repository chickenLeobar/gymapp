import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { switchMap, tap, take } from 'rxjs/operators';
import { Observable, iif, defer } from 'rxjs';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { SedeService } from './sede.service';
import { ISede } from '..';
import producer from 'immer';
import { filtersAreDirty } from '@helpers/helpers';
type Filters = {
  query: string;
};
interface SedeState {
  sedes: ISede[];
  selectedSede: number;
  filters?: Filters;
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
      switchMap(({ sede }) => {
        return iif(
          () => !sede?.id,
          defer(() => this._sedeService.createSede(sede)),
          defer(() => this._sedeService.updateSede(sede.id, sede))
        );
      }),
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
      tap((sede: ISede) => {
        this.deleteSedeState(sede);
      })
    );
  });

  constructor(private _sedeService: SedeService) {
    super({
      sedes: [],
      selectedSede: null
    });
    this.getSedes({});
  }
  /*=============================================
  =            updaters            =
  =============================================*/
  public addOrUpdateSede = this.updater((state, { sede }: { sede: ISede }) => {
    const newState = producer(state, draf => {
      const sedes = draf.sedes;
      let existSede = sedes.findIndex(sede_ => sede_.id == sede.id);
      if (existSede == -1) {
        sedes.push(sede as NzSafeAny);
      } else {
        sedes[existSede] = sede;
      }
    });

    return {
      ...newState
    };
  });

  public passFilters = this.updater((state, filters: Filters) => {
    state = {
      ...state,
      filters
    };
    console.log(state);

    return state;
  });

  public addSelectSede = this.updater((state, sede: ISede) => {
    return {
      ...state,
      selectedSede: sede.id
    };
  });

  public deleteSedeState = this.updater((state, sede: ISede) => {
    const newState = producer(state, draf => {
      const sedes = draf.sedes;
      const sedeForDelete = sedes.findIndex(sede_ => sede_.id == sede.id);
      delete sedes[sedeForDelete];
    });
    return {
      ...newState
    };
  });

  /*=============================================
  =            selectors            =
  =============================================*/

  public $sedesAndSearch = this.select(state => {
    const filters = state.filters;
    const sedes = state.sedes;
    const query = filters?.query;
    const filter = (sede: ISede) => {
      if (query) {
        return sede.name.indexOf(query) >= 0;
      }
      return false;
    };
    if (!filtersAreDirty(filters)) {
      return sedes;
    }
    return sedes.filter(filter);
  });

  public selectSede$ = this.select(state => {
    const id = state.selectedSede;
    return id && state.sedes.find(sede => sede.id == id);
  });

  /*=============================================
  =            view            =
  =============================================*/

  public vm$ = this.select(this.$sedesAndSearch, sedes => {
    return {
      sedes
    };
  });
}
