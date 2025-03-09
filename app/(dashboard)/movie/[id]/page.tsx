"use client";
import { Movie } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/layout";

const directory = getAbsolutePath(`../${getVersion()}/movie`);
const MoviePage = () => {
  return (
    <DataDetail
      endpoint={`${SERVER_URL}${directory}/movie.json`}
      render={(movie: Movie) => (
        <div>
          <h2>{movie.name}</h2>
          <p>{movie.id}</p>
          <p>{movie.filename}</p>
          <video>
            <source src={`${SERVER_URL}${directory}/${movie.mp4name}`}></source>
          </video>
        </div>
      )}
    />
  );
};

export default MoviePage;
