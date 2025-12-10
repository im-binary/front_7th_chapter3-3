import { useState, useEffect } from "react";
import type { Tag } from "../../../entities/tag";
import { tagsApi } from "../../../entities/tag/api/tagsApi";

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagsApi.getTags();

        setTags(data);
      } catch (error) {
        console.error("태그 가져오기 오류:", error);
      }
    };

    fetchTags();
  }, []);

  return { tags };
};
