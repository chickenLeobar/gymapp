import { isNull, isUndefined } from "lodash";
import { MODEEVENT } from "./../../globals/types";
import { Event } from "./../../entity/events/Event";
import { Repository, FindManyOptions, FindConditions } from "typeorm";
import { Categorie, InputCategorie } from "./categorie.type";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import config from "../../config/configstore";
@Service()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private respositoryCategorie: Repository<Categorie>,
    @InjectRepository(Event)
    private repositoryEvent: Repository<Event>
  ) {}
  async createCategorie(categorie: InputCategorie) {
    const cat = this.respositoryCategorie.create(categorie);
    return await this.respositoryCategorie.save(cat);
  }

  async getCategories({ id_categorie }: { id_categorie?: number }) {
    let filters = {
      order: { createCategorie: "DESC" },
    } as FindManyOptions<Categorie>;
    if (!isNull(id_categorie) && !isUndefined(id_categorie)) {
      filters.where = { id: id_categorie };
    }
    return await this.respositoryCategorie.find(filters);
  }

  async editCategorie(id: number, categorie: Partial<Categorie>) {
    const bdCategorie = await this.respositoryCategorie.findOne({ id });
    if (bdCategorie) {
      const mergeEntity = this.respositoryCategorie.merge(
        bdCategorie,
        categorie
      );
      await this.respositoryCategorie.update(id, mergeEntity);
      return mergeEntity;
    }
    return null;
  }

  async getEventsOfCategory(
    idCategory: number,
    modeEvent?: MODEEVENT,
    recents?: boolean
  ) {
    let filters = { order: { createEvent: "DESC" } } as FindManyOptions<Event>;
    let whereClause = {} as FindConditions<Event>;
    // if recentes not filter with category
    if (!isNull(recents) && !isUndefined(recents)) {
      const recentsEvents = config.get("queries.recentsEvents");
      if (!recentsEvents) {
        throw new Error("recents count not provider");
      }
      filters.take = Number(recentsEvents);
    }
    if (idCategory != -1) {
      whereClause.category_id = idCategory;
    }
    if (!isNull(modeEvent)) {
      whereClause.modeEvent = modeEvent;
    }

    filters.where = whereClause;

    return await this.repositoryEvent.find(filters);
  }
}
