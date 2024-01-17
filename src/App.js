import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

const IMAGE_PER_PAGE = 20;
function App() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = async () => {
    try {
      if (page <= totalPages) {
        const result =
          page <= totalPages &&
          (await axios.get(
            `${process.env.REACT_APP_API_URL}?query=${query}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`
          ));
        console.log(
          `${process.env.REACT_APP_API_URL}?query=${query}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`
        );
        setPosts((prevPosts) => [...prevPosts, ...result.data.results]);
        setTotalPages(result.data?.total_pages);
        setIsFetching(false);
      } else {
        setIsFetching(false);
        window.scrollBy(0, -window.innerHeight);
        alert("No More Data Found");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => {
        return prevPage + 1;
      });
      setIsFetching(true);
    }
  };

  useEffect(() => {
    if (query !== "") {
      var timeout;
      timeout = setTimeout(() => {
        fetchImages();
      }, 1000);
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    setPosts([]);
    setPage(1);
    setTotalPages(1);
    setIsFetching(true);
    fetchImages();
  };

  return (
    <div className="App">
      <Grid container justifyContent={"center"} mt={2}>
        <Grid container justifyContent={"center"} item xs={12}>
          <Typography variant="h4" fontWeight={600} textTransform={"uppercase"}>
            Image Finder
          </Typography>
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"center"}
          item
          xs={12}
          my={1}
          maxWidth={600}
        >
          <TextField
            sx={{ width: 600 }}
            size="small"
            type="search"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <div id="gallery" className="container-fluid">
        {posts.length > 0 &&
          posts?.map((image) => {
            return (
              <img
                key={image?.id}
                src={image?.urls?.regular}
                alt={image?.alt_description}
                className="img-responsive"
              />
            );
          })}
      </div>
      {isFetching && (
        <Box sx={{ width: "90%", paddingY: 10, marginX: "auto" }}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
