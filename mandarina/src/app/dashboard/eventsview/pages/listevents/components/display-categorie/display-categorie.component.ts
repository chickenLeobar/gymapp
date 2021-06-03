import { UtilsService } from '@services/utils.service';
import { Component, OnInit, Input } from '@angular/core';
import { Icategorie } from 'src/app/dashboard/categorie/model.categorie';

@Component({
  selector: 'app-display-categorie',
  template: `<div class="container_categorie">
    <img [src]="categorie.image.url" />
    <div class="overlay"></div>
    <div class="text">
      <h1 class="title">
        {{ categorie.name }}
      </h1>
      <p>
        {{ categorie.description | shortParagraph: countLetters }}
      </p>
    </div>
  </div>`,
  styleUrls: ['./display-categorie.component.scss'],
  host: {
    '(mouseenter)': 'enterCategorie($event)',
    '(mouseleave)': 'overCategorie($event)',
  },
})
export class DisplayCategorieComponent implements OnInit {
  private source: Icategorie;
  countLetters = 200;
  @Input()
  set categorie(ev: Icategorie) {
    this.source = {
      ...ev,
      image: {
        url: this.utilsService.resolvePathImage(ev.image.key) as string,
      },
    };
  }
  get categorie() {
    return this.source;
  }
  enterCategorie($event) {
    console.log('enter ');

    this.countLetters = this.categorie.description.length;
  }
  overCategorie($event) {
    console.log('over');

    this.countLetters = 250;
  }
  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {}
}
