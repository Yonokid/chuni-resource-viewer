"use client";
import { Movie } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Box } from "@mui/material";

const MoviePage = () => {
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "movie/movie.json")}
      render={(movie: Movie) => (
        <Fragment>
          <Typography variant="h4">{movie.name}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <video
              controls
              preload="metadata"
              style={{ maxWidth: "100%", width: 800 }}
            >
              <source src={getBaseUrl("chuni", `movie/${movie.mp4name}`)} type="video/mp4" />
            </video>
          </Box>
        </Fragment>
      )}
    />
  );
};

export default MoviePage;
