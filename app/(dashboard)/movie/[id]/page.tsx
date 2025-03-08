"use client";
import { Movie } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/movie`);
const MoviePage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/movie.json`}
      render={(movie: Movie) => (
        <div>
          <h2>{movie.name}</h2>
          <p>{movie.id}</p>
          <p>{movie.filename}</p>
          <video>
            <source src={`${directory}/${movie.mp4name}`}></source>
          </video>
        </div>
      )}
    />
  );
};

export default MoviePage;
