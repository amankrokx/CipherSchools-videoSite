import { Box, IconButton, useMediaQuery, useTheme, Typography } from "@mui/material";
import React, { useEffect } from "react";
import LoaderUtils from "../../components/Loader/LoaderUtils";
import SnackbarUtils from "../../components/SnackbarUtils";
import AuthContext from "../../firebase/auth/AuthContext";
import "./index.css"

// function to convert seconds to HH:MM:SS format
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + " : " : "";
    var mDisplay = m > 0 ? m + " : " : "0 :";
    var sDisplay = s > 0 ? s + " " : "00";
    return hDisplay + mDisplay + sDisplay;
}


export default function Home() {
    const theme = useTheme();
    const [refresh, setRefresh] = React.useState(0);
    const [videos, setVideos] = React.useState([]); // [video, video, video
    const [error, setError] = React.useState(false);
    const authContext = React.useContext(AuthContext);
    const matches = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        LoaderUtils.halt()
        if (!authContext.user) return;
        console.log("Home mounted");
        (async () => {
            const token = await authContext.user.getIdToken();
            fetch("/api/listVideos/new", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    SnackbarUtils.error(res.message);
                    setError(true)
                    return;
                }
                // console.log(res)
                setError(false)
                setVideos(res.data);
                LoaderUtils.unhalt()
            })
            .catch((err) => {
                setError(true)
                console.log(err);
                LoaderUtils.unhalt()
            })
        })()
                
    }, [refresh, authContext.user])

    return <Box sx={{
        
    }}>
        {error && <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%"
        }}>
            <IconButton size="large" onClick={() => {
                setError(false)
                setRefresh(refresh + 1)
            }}>
                <span style={{fontSize: 36}} className="material-icons">refresh</span>
            </IconButton>
                <Typography variant="caption" color={theme.palette.white.main}>Something went wrong ! Try again ?</Typography>
        </div>}
        {!error && <div className="videoListContainer" style={{

            width: "100%",
            overflowX: "hidden",
            overflowY: "overlay",
            margin: "0 auto",
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
            gridTemplateColumns: matches ? "1fr" : "1fr 1fr 1fr",
            gridGap: "16px",
            padding: matches ? 0 : "16px",
            boxSizing: "border-box",
            color: theme.palette.white.main
        }}>
        {videos.map((video) => {
            return (
                <div className="videoList" key={video.videoId || video._id}>
                    <img src={video.thumbnailUrl} alt="thumbnail" />
                    <div className="text">
                        <div className="duration">{secondsToHms(video.length)}</div>
                        <div className="title">
                            <span>{video.title}</span>
                            <span>{video.description}</span>
                        </div>
                        <div className="stats">
                            <span className="material-icons">visibility</span>
                            <span>{video.views}</span>
                        </div>
                    </div>
                </div>
            )
        })}
        </div>
        }
    </Box>
}