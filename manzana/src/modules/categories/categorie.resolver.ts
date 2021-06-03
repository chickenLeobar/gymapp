import { ERol } from "./../../enums/Auth.enums";
import { ResponseCategory } from "./responses.category";
import { Categorie, InputCategorie } from "./categorie.type";
import {
  Arg,
  Mutation,
  Resolver,
  Query,
  ID,
  Args,
  Authorized,
} from "type-graphql";
import { Service } from "typedi";
import { CategorieService } from "./categorie.service";
import { ArgsCategory } from "./Args.type";
@Resolver()
@Service()
export class CategorieResolver {
  constructor(private categorieService: CategorieService) {}
  @Mutation((type) => Categorie)
  async createCategorie(
    @Arg("categorie", () => InputCategorie) categorie: InputCategorie
  ): Promise<Categorie> {
    return await this.categorieService.createCategorie(categorie);
  }
  @Query((type) => [Categorie])
  categories(@Arg("idCategorie", () => ID, { nullable: true }) id: number) {
    return this.categorieService.getCategories({ id_categorie: id });
  }
  @Mutation((type) => Categorie)
  @Authorized(ERol.ASESOR)
  async editCategory(
    @Arg("id", (type) => ID) id: number,
    @Arg("categorie") categorie: InputCategorie
  ) {
    return await this.categorieService.editCategorie(id, categorie);
  }

  @Query((type) => ResponseCategory)
  @Authorized()
  async eventsCategory(
    @Args() { idCategory, modeEvent, recents }: ArgsCategory
  ): Promise<ResponseCategory> {
    const events = await this.categorieService.getEventsOfCategory(
      idCategory,
      modeEvent,
      recents
    );
    const count = events.length;
    return {
      items: events,
      count: count,
    };
  }
}
