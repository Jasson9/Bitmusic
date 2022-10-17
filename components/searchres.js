const styles = require("../styles/player.module.scss")
const $ = require("jquery");
const React = require("react");
//const [searchResult, setSearchResult] = React.useState("test");
var searchResult = "";
function setSearchResult(data){
    searchResult = data;
}

async function searchSong(){
    var query = document.getElementById("searchinput");
    console.log(query.value)
    if(query.value){
        document.getElementById("searchIcon")?.setAttribute("hidden","");
        document.getElementById("searchingIcon")?.removeAttribute("hidden");
        $.ajax({method:"POST",url:"/api/searchYt",data:{"query":query.value},dataType:"json"}).then(res=>{
        var results = res.data;
        console.log(results)
        //setSearchResult(res.data);
        //searchResult = new Array;
        setSearchResult(<h3 style={{color:"aliceblue",fontSize:"3vmin"}}>Search Result for {query.value} { results.map((res,key)=><div key={key} className={styles.resultcontainer}>
            <div className={styles.thumbnailcontainer}>
                <img className={styles.resultthumbnail} src={res.thumbnail}></img>
                <div className={styles.resultdurationtext}>{parseTimeFromSeconds(res.duration)}</div>
            </div>
            <div className={styles.resultdata}>
            <div className={styles.resulttext}>
                <div className={styles.resultTitle}>{res.title}</div>
                <div className={styles.resultAuthor}>{res.author}</div>
                </div>
            <div className={styles.resulticons}>
            <div id={"StartplayButton-"+res.url} onClick={()=>addAndPlay(res,false)}>
                <IconButton>
                    <PlayIcon/>
                </IconButton>
            </div>
            <div id={"LoadingPlayIcon-"+res.url} hidden>
                <CircularProgress size={"24px"}/>
            </div>
            <div onClick={()=>downloadSong(res.url) } id={"DownloadIcon-"+res.url}>
                <IconButton>
                    <DownloadIcon/>
                </IconButton>
            </div>
            <div id={"DownloadProgressIcon-"+res.url} hidden>
                <CircularProgress/>
            </div>
            <a id={"DownloadDoneIcon-"+res.url} hidden target={"_blank"} rel={"noreferrer"}>
                <IconButton>
                    <DownloadDoneIcon />
                </IconButton>
            </a>
            <a href={res.url} target={"_blank"} rel={"noreferrer"}>
                <IconButton>
                    <YouTubeIcon/>
                </IconButton>
            </a>
            </div>
            </div>
            </div>
            )}</h3>)
        document.getElementById("searchingIcon")?.setAttribute("hidden","");
        document.getElementById("searchIcon")?.removeAttribute("hidden");
    }).catch((err)=>{
        document.getElementById("searchingIcon")?.setAttribute("hidden","");
        document.getElementById("searchIcon")?.removeAttribute("hidden");
        console.log(err)
    })
    }

    
}

function SearchResultComponent(){
    
    return (
        <div id="resultcontainer" className={[styles.pagecontent, "container-xl"].join(" ")}>
        <div className={[styles.searchresults].join(" ")}>
          {searchResult}
            <div className={styles.resultcontainer} id="resultpad" style={{height:"0px"}}></div>
        </div>
    </div>
    )
}

export {searchSong}
export default SearchResultComponent