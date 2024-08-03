import { supabaseClient } from "../lib/supabaseClient";
//replace http://139.59.31.77:3000 with https://lazyweb.rocks from all resources image_url in supabase
export const replaceImageNameFromAllResources = async () => {
  const { data, error } = await supabaseClient
    .from("website")
    .select("id, image_url, title");
  if (error) {
    console.log(error);
  }
  if (data) {
    data.forEach(async (resource) => {
      const newImageUrl = resource.image_url.replace(
        "api.lazyweb.rocks",
        "https://api.lazyweb.rocks"
      );
      const { data, error } = await supabaseClient
        .from("website")
        .update({ image_url: newImageUrl })
        .eq("id", resource.id);
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    });
  }

  return { data, error };
};

//replace all images url from .png to .webp from all resources image_url in supabase
export const replaceImageNameFromAllResourcesToWebp = async () => {
  const { data, error } = await supabaseClient
    .from("website")
    .select("id, image_url, title");
  if (error) {
    console.log(error);
  }
  if (data) {
    data.forEach(async (resource) => {
      const newImageUrl = resource.image_url.replace(".png", ".webp");
      const { data, error } = await supabaseClient
        .from("website")
        .update({ image_url: newImageUrl })
        .eq("id", resource.id);
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    });
  }

  return { data, error };
};
