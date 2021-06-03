import { tap, pluck, takeUntil } from 'rxjs/operators';
import { Icategorie } from './model.categorie';
import { Injectable, OnDestroy } from '@angular/core';

import { gql, Apollo, QueryRef } from 'apollo-angular';
import { CATEGORIE_FRAGMENT } from '@fragments/categorie';

import { Observable, Subject } from 'rxjs';
import { ActionService } from '@services/action.service';
const CREATE_CATEGORIE = gql`
  ${CATEGORIE_FRAGMENT}
  mutation createCategorie($categorie: InputCategorie!) {
    createCategorie(categorie: $categorie) {
      ...categorieFragment
    }
  }
`;

const EDIT_CATEGORIE = gql`
  ${CATEGORIE_FRAGMENT}
  mutation editCategorie($categorie: InputCategorie!, $id: ID!) {
    editCategory(categorie: $categorie, id: $id) {
      ...categorieFragment
    }
  }
`;

const ALL_CATEGORIEE = gql`
  ${CATEGORIE_FRAGMENT}
  query getCategorie {
    categories {
      ...categorieFragment
    }
  }
`;

@Injectable()
export class CategorieService implements OnDestroy {
  private unsuscribe$: Subject<void> = new Subject<void>();
  private refCategories: QueryRef<{ categories: Icategorie[] }>;
  constructor(private apollo: Apollo, private actionService: ActionService) {
    this.refCategories = this.apollo.watchQuery({ query: ALL_CATEGORIEE });
    this.actionService
      .suscribeEvents('ADDEVENT')
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: () => {
          this.refetchCategories();
        },
      });
  }
  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  public getCategories() {
    return this.refCategories.valueChanges.pipe(pluck('data', 'categories'));
  }

  private refetchCategories() {
    this.refCategories.refetch();
  }
  public createCategorie(categorie: Icategorie): Observable<Icategorie> {
    return this.apollo
      .mutate({
        mutation: CREATE_CATEGORIE,
        variables: {
          categorie,
        },
      })
      .pipe(
        tap(() => this.refetchCategories()),
        pluck('data', 'createCategorie')
      );
  }

  public editCategorie(id: number, categorie: Icategorie) {
    return this.apollo
      .mutate({
        mutation: EDIT_CATEGORIE,
        variables: {
          id,
          categorie,
        },
      })
      .pipe(tap(console.log));
  }
}
