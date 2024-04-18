CUANDO SE CREEN LOS ARCHIVOS JS 
AGREGAR FORMATO DE LA SIGUIENTE FORMATO

    const[filterText, setFilterText] = useState("");
    const[data, setData] = useState([{id_post: 0, title: "", date: "", text:"", image: "", id_author:0}]);

    useEffect(() => {
      fetch('http://localhost:8000/posts')
      .then((res) => res.json())
      .then((posts) => setData(posts));
    }, []);

    --------------
    OBSERVAR LINEAS 
    server.js 13 y 15
    