import { Event } from "./../entity/events/Event";
import { InputEvent } from "./../types/events/Even.input";
import { v2 as Cloudinary } from "cloudinary";
/*=============================================
 =            metods   cludinary         =
 =============================================*/
export const verifiFyandDeleteResourceCloudinary = async (
  newEvent: string,
  oldEvent: string,
  order: string
): Promise<boolean> => {
  /** crear un metodo  que pasando dos parametros
   * si viene null y tu tienes data en la bd -> eliminar el recuso de cloudinary
   * si viene data y tu tienes data ->  si las datas son iguales -> no haces nada ? elimina el recurso de la antigua data en cloudinary
   */
  const oldResource = oldEvent ? JSON.parse(oldEvent) : null;
  const newResource = newEvent ? JSON.parse(newEvent) : null;
  //   console.log("this a results");
  //   console.log(oldResource);
  //   console.log(newResource);
  if (oldResource === null) {
    return false;
  }
  if (newResource === null && oldResource === null) {
    return false;
  }
  if (newResource && newResource?.public_id === oldResource?.public_id) {
    console.log("result equals");
    return false;
  }    

  if (order === "delete" || newResource) {
    if (oldResource) {
      // delete resource
      // docuementation :  https://cloudinary.com/documentation/admin_api#delete_resources
      const public_id = oldResource.public_id;
      try {
        const res = await Cloudinary.api.delete_resources([public_id], {
          resource_type: "video",
        });
        console.log("======= se ha eliminado una sesión=====");
        console.log(res);
        return true;
      } catch (er) {
        return false;
      }
    }
  }
  return false;
};
