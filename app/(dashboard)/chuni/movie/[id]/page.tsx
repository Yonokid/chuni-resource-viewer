"use client";
import { Movie } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";

const MoviePage = () => {
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "movie/movie.json")}
      render={(movie: Movie) => (
        <div>
          <h2>{movie.name}</h2>
          <p>{movie.id}</p>
          <p>{movie.filename}</p>
          <video>
            <source src={getBaseUrl("chuni", `movie/${movie.mp4name}`)}></source>
          </video>
        </div>
      )}
    />
  );
};

export default MoviePage;
