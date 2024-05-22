--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-22 06:30:26 CST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 26966)
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- TOC entry 2 (class 3079 OID 26967)
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- TOC entry 3665 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


--
-- TOC entry 264 (class 1255 OID 27125)
-- Name: calcular_deuda_cliente(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_deuda_cliente(cliente_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE 
    deuda DECIMAL(10, 2);
BEGIN
    SELECT SUM(monto_T)
    INTO deuda
    FROM Pago
    WHERE id_Cliente = cliente_id;

    RETURN deuda;
END;
$$;


ALTER FUNCTION public.calcular_deuda_cliente(cliente_id integer) OWNER TO postgres;

--
-- TOC entry 276 (class 1255 OID 27126)
-- Name: calcular_suma_servicios_por_tipo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_suma_servicios_por_tipo(id_cliente integer) RETURNS TABLE(servicio1 integer, servicio2 integer, servicio3 integer, servicio4 integer, servicio5 integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Inicializar todas las variables a 0
    servicio1 := 0;
    servicio2 := 0;
    servicio3 := 0;
    servicio4 := 0;
    servicio5 := 0;

    -- Obtener la cantidad de servicios por tipo
    FOR rec IN SELECT id_Servicio, SUM(cant) AS suma_cantidades
               FROM "servcliente" sc
               WHERE sc.id_Cliente = calcular_suma_servicios_por_tipo.id_cliente
               GROUP BY id_Servicio
    LOOP
        -- Asignar la cantidad correspondiente a la columna de servicio adecuada
        CASE rec.id_Servicio
            WHEN 1 THEN servicio1 := rec.suma_cantidades;
            WHEN 2 THEN servicio2 := rec.suma_cantidades;
            WHEN 3 THEN servicio3 := rec.suma_cantidades;
            WHEN 4 THEN servicio4 := rec.suma_cantidades;
            WHEN 5 THEN servicio5 := rec.suma_cantidades;
        END CASE;
    END LOOP;

    -- Devolver la fila con las cantidades de servicios por tipo
    RETURN NEXT;
END;
$$;


ALTER FUNCTION public.calcular_suma_servicios_por_tipo(id_cliente integer) OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 27127)
-- Name: gencargodiario_proc(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.gencargodiario_proc()
    LANGUAGE plpgsql
    AS $$
	DECLARE
	BEGIN
		INSERT INTO pago (id_cliente, notas_p, monto_t, fecha_p)
		SELECT id_cliente, 'Cobro Automático Diario', -20.00, NOW()
		FROM huesped
		WHERE fecha_s IS NULL;
	END;
	$$;


ALTER PROCEDURE public.gencargodiario_proc() OWNER TO postgres;

--
-- TOC entry 278 (class 1255 OID 27128)
-- Name: genservcliente_proc(integer, integer[]); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[])
    LANGUAGE plpgsql
    AS $$
DECLARE
servicio_info INT[];
servicio_id INT;
cantidad INT;
BEGIN
FOREACH servicio_info SLICE 1 IN ARRAY listService
LOOP
servicio_id := servicio_info[1];
cantidad := servicio_info[2];
IF cantidad > 0 THEN
INSERT INTO "servcliente" ("id_cliente", "id_servicio", "cant", "fecha_u", "tipo_cliente")
VALUES (cliente_id, servicio_id, cantidad, CURRENT_TIMESTAMP, FALSE);
END IF;
END LOOP;
END;
$$;


ALTER PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[]) OWNER TO postgres;

--
-- TOC entry 279 (class 1255 OID 27129)
-- Name: genservcliente_prochuesped(integer, integer[]); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.genservcliente_prochuesped(IN cliente_id integer, IN listservice integer[])
    LANGUAGE plpgsql
    AS $$
DECLARE
servicio_info INT[];
servicio_id INT;
cantidad INT;
BEGIN
FOREACH servicio_info SLICE 1 IN ARRAY listService
LOOP
servicio_id := servicio_info[1];
cantidad := servicio_info[2];
IF cantidad > 0 THEN
INSERT INTO "servcliente" ("id_cliente", "id_servicio", "cant", "fecha_u", "tipo_cliente")
VALUES (cliente_id, servicio_id, cantidad, CURRENT_TIMESTAMP, TRUE);
END IF;
END LOOP;
END;
$$;


ALTER PROCEDURE public.genservcliente_prochuesped(IN cliente_id integer, IN listservice integer[]) OWNER TO postgres;

--
-- TOC entry 280 (class 1255 OID 27130)
-- Name: getclientsbyfiltergeneral_func(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getclientsbyfiltergeneral_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_u character varying, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY EXECUTE
'SELECT DISTINCT cliente.id_cliente, usuario.nombre_u, cliente.nombre_c, cliente.apellidos_c, servcliente.tipo_cliente, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total,
CASE WHEN vetado.id_cliente IS NOT NULL THEN TRUE ELSE FALSE END AS Vetado
FROM cliente
LEFT JOIN usuario ON cliente.id_usuario = usuario.id_usuario
LEFT JOIN servcliente ON cliente.id_cliente = servcliente.id_cliente
LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
LEFT JOIN absolutedeudas ON cliente.id_cliente = absolutedeudas.id_cliente
' || whereClause || '
ORDER BY total DESC';
END;
$$;


ALTER FUNCTION public.getclientsbyfiltergeneral_func(whereclause text) OWNER TO postgres;

--
-- TOC entry 281 (class 1255 OID 27131)
-- Name: getclientsbyfilterhuesped_func(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getclientsbyfilterhuesped_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN QUERY EXECUTE
	'SELECT DISTINCT cliente.id_cliente, huesped.id_cama, cliente.nombre_c, cliente.apellidos_c, huesped.fecha_i, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total,
	CASE WHEN vetado.id_cliente IS NOT NULL THEN TRUE ELSE FALSE END AS Vetado
	FROM cliente
	RIGHT JOIN huesped ON cliente.id_cliente = huesped.id_cliente
	LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
	LEFT JOIN absolutedeudas ON cliente.id_cliente = absolutedeudas.id_cliente
	' || whereClause || '
	ORDER BY total DESC';
END;
$$;


ALTER FUNCTION public.getclientsbyfilterhuesped_func(whereclause text) OWNER TO postgres;

--
-- TOC entry 282 (class 1255 OID 27132)
-- Name: getclientsbyfilterservicios_func(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getclientsbyfilterservicios_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, carnet character varying, desayuno bigint, comida bigint, cena bigint, l_fecha_u timestamp without time zone, nivel_se integer, total numeric, vetado boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN QUERY EXECUTE
	'SELECT cliente.id_cliente, nombre_c, apellidos_c, tipo_cliente, carnet,
	SUM(CASE WHEN servCliente.id_servicio = 3 THEN servCliente.cant ELSE 0 END) AS Desayuno,
    	SUM(CASE WHEN servCliente.id_servicio = 4 THEN servCliente.cant ELSE 0 END) AS Comida,
    	SUM(CASE WHEN servCliente.id_servicio = 5 THEN servCliente.cant ELSE 0 END) AS Cena,
	MAX(servCliente.fecha_u) AS l_fecha_u,
	nivel_se, total,
	CASE WHEN vetado.id_cliente IS NOT NULL THEN TRUE ELSE FALSE END AS Vetado
	FROM cliente
	RIGHT JOIN servCliente ON cliente.id_cliente = servCliente.id_cliente
	LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
	LEFT JOIN absoluteDeudas ON cliente.id_cliente = absoluteDeudas.id_cliente
	' || whereClause || '
	GROUP BY cliente.id_cliente, servCliente.tipo_cliente, absoluteDeudas.total, vetado.id_cliente
	ORDER BY l_fecha_u DESC';
END;
$$;


ALTER FUNCTION public.getclientsbyfilterservicios_func(whereclause text) OWNER TO postgres;

--
-- TOC entry 283 (class 1255 OID 27133)
-- Name: getclientsbyfiltervisitaprevia_func(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, fecha_s timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN QUERY EXECUTE
	'SELECT DISTINCT cliente.id_cliente, logsalidas.id_cama, cliente.nombre_c, cliente.apellidos_c, logsalidas.fecha_i, logsalidas.fecha_s, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total,
	CASE WHEN vetado.id_cliente IS NOT NULL THEN TRUE ELSE FALSE END AS Vetado
	FROM cliente
	RIGHT JOIN logsalidas ON cliente.id_cliente = logsalidas.id_cliente
	LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
	LEFT JOIN absoluteDeudas ON cliente.id_cliente = absoluteDeudas.id_cliente
	' || whereClause || '
	ORDER BY total DESC;';
END;
$$;


ALTER FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text) OWNER TO postgres;

--
-- TOC entry 284 (class 1255 OID 27134)
-- Name: registrarsalida_func(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registrarsalida_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO logSalidas (id_cliente, id_cama, fecha_i, fecha_s)
VALUES (OLD.id_cliente, OLD.id_cama, OLD.fecha_i, NEW.fecha_s);
DELETE FROM huesped WHERE id_cliente = OLD.id_cliente;
RETURN OLD;
END;
$$;


ALTER FUNCTION public.registrarsalida_func() OWNER TO postgres;

--
-- TOC entry 285 (class 1255 OID 27135)
-- Name: veto_proc(integer, integer, text); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.veto_proc(IN id_u integer, IN id_c integer, IN n_v text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM huesped WHERE id_cliente = id_c) THEN
		UPDATE huesped
        SET fecha_S = NOW()
        WHERE id_Cliente = id_c;
    END IF;
	
	INSERT INTO vetado(id_usuario, id_cliente, notas_v, fecha_v)
	VALUES(id_u, id_c, n_v, CURRENT_TIMESTAMP);
END;
$$;


ALTER PROCEDURE public.veto_proc(IN id_u integer, IN id_c integer, IN n_v text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 27136)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    id_usuario integer,
    carnet character varying,
    nombre_c character varying,
    apellidos_c character varying,
    lugar_o character varying,
    notas_c character varying,
    sexo boolean,
    paciente boolean,
    nivel_se integer,
    checked boolean
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 27141)
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_cliente integer,
    notas_p character varying,
    monto_t numeric(7,2),
    fecha_p timestamp without time zone
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 27146)
-- Name: deudaclientes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.deudaclientes AS
 SELECT cliente.id_cliente,
    sum(pago.monto_t) AS total
   FROM (public.cliente
     LEFT JOIN public.pago ON ((cliente.id_cliente = pago.id_cliente)))
  GROUP BY cliente.id_cliente
  ORDER BY (sum(pago.monto_t));


ALTER VIEW public.deudaclientes OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 27150)
-- Name: absolutedeudas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.absolutedeudas AS
 SELECT id_cliente,
    abs(total) AS total
   FROM public.deudaclientes;


ALTER VIEW public.absolutedeudas OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 27154)
-- Name: area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.area (
    id_area integer NOT NULL,
    nombre_a character varying
);


ALTER TABLE public.area OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 27159)
-- Name: area_id_Area_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.area ALTER COLUMN id_area ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."area_id_Area_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 27160)
-- Name: cama; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_zona integer
);


ALTER TABLE public.cama OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 27163)
-- Name: cama_id_Cama_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cama ALTER COLUMN id_cama ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cama_id_Cama_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 27164)
-- Name: colorescama; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.colorescama AS
 SELECT id_cliente,
        CASE
            WHEN (total > (- (40)::numeric)) THEN '#8cbcfc'::text
            WHEN (total <= (- (40)::numeric)) THEN '#EE7171'::text
            ELSE NULL::text
        END AS color
   FROM public.deudaclientes
  ORDER BY id_cliente;


ALTER VIEW public.colorescama OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 27168)
-- Name: huesped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.huesped (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);


ALTER TABLE public.huesped OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 27171)
-- Name: camasgralinfo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.camasgralinfo AS
 SELECT cama.id_cama,
    cama.id_zona,
    cl.id_cliente,
    cl.carnet,
    cl.nombre_c,
    cl.apellidos_c,
    deudaclientes.total AS balance,
    colorescama.color
   FROM ((((public.cama
     LEFT JOIN public.huesped ON ((cama.id_cama = huesped.id_cama)))
     LEFT JOIN public.cliente cl ON ((huesped.id_cliente = cl.id_cliente)))
     LEFT JOIN public.deudaclientes ON ((huesped.id_cliente = deudaclientes.id_cliente)))
     LEFT JOIN public.colorescama ON ((huesped.id_cliente = colorescama.id_cliente)))
  ORDER BY cama.id_cama;


ALTER VIEW public.camasgralinfo OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 27176)
-- Name: cliente_id_Cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cliente ALTER COLUMN id_cliente ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cliente_id_Cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 27177)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    entry_job timestamp without time zone DEFAULT now()
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 27181)
-- Name: logsalidas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logsalidas (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);


ALTER TABLE public.logsalidas OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 27184)
-- Name: paciente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paciente (
    carnet character varying NOT NULL,
    id_area integer,
    nombre_p character varying,
    apellidos_p character varying
);


ALTER TABLE public.paciente OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 27189)
-- Name: pago_id_Pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pago ALTER COLUMN id_pago ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."pago_id_Pago_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 27190)
-- Name: servcliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servcliente (
    id_cliente integer,
    id_servicio integer,
    cant integer,
    fecha_u timestamp without time zone,
    tipo_cliente boolean
);


ALTER TABLE public.servcliente OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 27193)
-- Name: servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre_s character varying,
    cargo_s numeric(7,2)
);


ALTER TABLE public.servicio OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 27198)
-- Name: servicio_id_Servicio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."servicio_id_Servicio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 251 (class 1259 OID 27199)
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    token character varying,
    id_token integer NOT NULL
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 27204)
-- Name: tokens_id_token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_id_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_id_token_seq OWNER TO postgres;

--
-- TOC entry 3666 (class 0 OID 0)
-- Dependencies: 252
-- Name: tokens_id_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_id_token_seq OWNED BY public.tokens.id_token;


--
-- TOC entry 253 (class 1259 OID 27205)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_u character varying,
    contrasena character varying,
    admin boolean
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 27210)
-- Name: usuario_id_Usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."usuario_id_Usuario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 255 (class 1259 OID 27211)
-- Name: vetado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vetado (
    id_usuario integer,
    id_cliente integer,
    notas_v character varying,
    fecha_v timestamp without time zone
);


ALTER TABLE public.vetado OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 27216)
-- Name: zona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zona (
    id_zona integer NOT NULL,
    nombre_z character varying
);


ALTER TABLE public.zona OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 27221)
-- Name: zona_id_Zona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.zona ALTER COLUMN id_zona ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."zona_id_Zona_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3423 (class 2604 OID 27222)
-- Name: tokens id_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id_token SET DEFAULT nextval('public.tokens_id_token_seq'::regclass);


--
-- TOC entry 3384 (class 0 OID 26968)
-- Dependencies: 217
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
\.


--
-- TOC entry 3385 (class 0 OID 26977)
-- Dependencies: 219
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- TOC entry 3386 (class 0 OID 26987)
-- Dependencies: 221
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- TOC entry 3388 (class 0 OID 27035)
-- Dependencies: 225
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- TOC entry 3389 (class 0 OID 27063)
-- Dependencies: 227
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- TOC entry 3390 (class 0 OID 27077)
-- Dependencies: 229
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- TOC entry 3387 (class 0 OID 27011)
-- Dependencies: 223
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- TOC entry 3391 (class 0 OID 27093)
-- Dependencies: 231
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- TOC entry 3639 (class 0 OID 27154)
-- Dependencies: 236
-- Data for Name: area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.area (id_area, nombre_a) FROM stdin;
1	Cirugía
2	M. Interna
3	Oncología
4	Nefrología
5	T. Médica
6	T. Intensiva
7	Recuperación
8	Consulta
9	Quemados
10	Urgencias
\.


--
-- TOC entry 3641 (class 0 OID 27160)
-- Dependencies: 238
-- Data for Name: cama; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cama (id_cama, id_zona) FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
11	1
12	1
13	1
14	1
15	1
16	1
17	1
18	1
19	1
20	1
21	1
22	1
23	1
24	1
25	1
26	1
27	1
28	1
29	1
32	2
33	2
34	2
35	2
36	2
37	2
38	2
39	2
40	2
41	2
42	2
43	2
44	2
45	2
46	2
47	2
48	2
49	2
50	2
51	2
52	2
53	2
54	2
55	2
56	2
57	2
58	2
59	2
60	2
61	2
62	2
63	2
64	3
65	3
67	1
68	1
69	1
70	1
\.


--
-- TOC entry 3637 (class 0 OID 27136)
-- Dependencies: 232
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id_cliente, id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, paciente, nivel_se, checked) FROM stdin;
1	1	CCAF123	Chrischris	Alberto Flores	Puebla	Es paciente en HNP	t	t	1	f
3	1	QCGM123	Odín	Guerra Martínez	Lázaro Cárdenas		t	f	3	t
4	1	QJLZG123	Else	Yves	Tepito	Esposo del paciente	t	f	2	t
6	2	UADMC123	María	Inés Tirikumarum	Sierra Norte	Vino con su esposa	f	f	2	t
9	1	adsasd	{}	{}	asdasd	asdasd	t	t	2	f
10	1	asdasd	{}	{}	asdasd	asdadsasdasdasd	t	t	1	f
12	6	63655690	uyuyuy	uyuyuyuyu	uyuyu		f	t	1	f
13	3	U896969	OPOOPPOPO	OPPOPL	bmnbn		t	f	2	t
14	6	656298698	Hola1	Hola2	JKLJJHJL		t	t	3	f
15	6	yitoit	jkjkbbn	ttuti	huiyik		f	t	4	f
16	6	i7t879t6978	nmbmbmn	bhjgkjgkj	yyuuyoyui		f	t	2	f
17	6	19883p90381	tutyi	b,bn	yuoiyuiy		f	f	3	f
\.


--
-- TOC entry 3643 (class 0 OID 27168)
-- Dependencies: 241
-- Data for Name: huesped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.huesped (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
3	44	2024-04-16 11:19:46	\N
10	38	2024-05-13 09:40:22.925494	\N
13	49	2024-05-19 14:35:50.335998	\N
16	8	2024-05-20 17:30:45.045536	\N
\.


--
-- TOC entry 3645 (class 0 OID 27177)
-- Dependencies: 244
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (entry_job) FROM stdin;
2024-04-19 19:48:03.157411
2024-04-19 19:48:07.944985
2024-04-19 19:48:18.250215
2024-04-19 19:49:03.749744
2024-04-19 19:50:04.400432
2024-04-19 19:51:04.7665
2024-04-19 19:52:00.244903
2024-04-19 19:48:03.157411
2024-04-19 19:48:07.944985
2024-04-19 19:48:18.250215
2024-04-19 19:49:03.749744
2024-04-19 19:50:04.400432
2024-04-19 19:51:04.7665
2024-04-19 19:52:00.244903
\.


--
-- TOC entry 3646 (class 0 OID 27181)
-- Dependencies: 245
-- Data for Name: logsalidas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logsalidas (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
6	13	2024-04-14 23:44:53	2024-05-17 23:58:42.146261
1	58	2024-04-14 09:16:33	2024-05-18 18:34:45.306864
14	52	2024-05-20 17:18:31.725097	2024-05-20 17:18:41.861342
9	35	2024-05-13 09:39:20.800598	2024-05-20 17:33:01.204862
\.


--
-- TOC entry 3647 (class 0 OID 27184)
-- Dependencies: 246
-- Data for Name: paciente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paciente (carnet, id_area, nombre_p, apellidos_p) FROM stdin;
QJLZG123	9	José	Zago Guevara
QCGM123	9	César	Guerra Martínez
UADMC123	10	Alejandro	Moctezuma Cruz
CCAF123	8	Christian	Alberto Flores
ODLB123	3	Daniela	Lozada Bracamonte
TIHM123	6	Hugo	Muñoz Munos
adsasd	9	asdads	asdads
asdasd	8	asdasd	asdasd
lkknknk	2	ljhkjjkbk	llhoihioñ
63655690	3	uyuyuy	uyuyuyuyu
U896969	5	uukhl	865656
656298698	4	Hola1	Hola2
yitoit	8	jkjkbbn	ttuti
i7t879t6978	3	nmbmbmn	bhjgkjgkj
19883p90381	2	tdrtdhgv	n.bmbn
97093184	5	Cedesdtrad	Alakpjapo
\.


--
-- TOC entry 3638 (class 0 OID 27141)
-- Dependencies: 233
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, id_cliente, notas_p, monto_t, fecha_p) FROM stdin;
1	1	Cargo diario	-20.00	2024-04-14 09:16:33
2	1	Pago	20.00	2024-04-14 22:55:23
3	1	Cargo diario	-20.00	2024-04-15 00:00:00
4	1	Cargo diario	-20.00	2024-04-16 00:00:00
9	3	Cargo diario	-20.00	2024-04-16 11:19:46
10	6	Cargo diario	-20.00	2024-04-14 23:44:53
11	6	Cargo diario	-20.00	2024-04-15 00:00:00
12	6	Cargo diario	-20.00	2024-04-16 00:00:00
13	6	Pago	60.00	2024-04-16 15:37:57
54	1	Cobro Automático Diario	-20.00	2024-04-20 00:01:03.819223
55	3	Cobro Automático Diario	-20.00	2024-04-20 00:01:03.819223
56	6	Cobro Automático Diario	-20.00	2024-04-20 00:01:03.819223
57	1	Cobro Automático Diario	-20.00	2024-04-21 00:01:01.103561
58	3	Cobro Automático Diario	-20.00	2024-04-21 00:01:01.103561
59	6	Cobro Automático Diario	-20.00	2024-04-21 00:01:01.103561
60	1	Cobro Automático Diario	-20.00	2024-04-22 09:25:46.104718
61	3	Cobro Automático Diario	-20.00	2024-04-22 09:25:46.104718
62	6	Cobro Automático Diario	-20.00	2024-04-22 09:25:46.104718
63	1	Cobro Automático Diario	-20.00	2024-04-23 09:04:07.0977
64	3	Cobro Automático Diario	-20.00	2024-04-23 09:04:07.0977
65	6	Cobro Automático Diario	-20.00	2024-04-23 09:04:07.0977
66	1	Cobro Automático Diario	-20.00	2024-04-24 09:05:54.214044
67	3	Cobro Automático Diario	-20.00	2024-04-24 09:05:54.214044
68	6	Cobro Automático Diario	-20.00	2024-04-24 09:05:54.214044
69	1	Cobro Automático Diario	-20.00	2024-04-25 09:10:12.662581
70	3	Cobro Automático Diario	-20.00	2024-04-25 09:10:12.662581
71	6	Cobro Automático Diario	-20.00	2024-04-25 09:10:12.662581
72	1	Cobro Automático Diario	-20.00	2024-04-26 09:10:03.376114
73	3	Cobro Automático Diario	-20.00	2024-04-26 09:10:03.376114
74	6	Cobro Automático Diario	-20.00	2024-04-26 09:10:03.376114
75	6	Pago	20.00	2024-05-04 12:22:09.119279
76	1	Cobro Automático Diario	-20.00	2024-05-05 00:01:04.147274
77	3	Cobro Automático Diario	-20.00	2024-05-05 00:01:04.147274
78	6	Cobro Automático Diario	-20.00	2024-05-05 00:01:04.147274
79	6	Agregado desde InfoUser2	10.00	2024-05-05 11:59:00.953254
80	1	Cobro Automático Diario	-20.00	2024-05-06 11:13:31.471216
81	3	Cobro Automático Diario	-20.00	2024-05-06 11:13:31.471216
82	6	Cobro Automático Diario	-20.00	2024-05-06 11:13:31.471216
83	1	Cobro Automático Diario	-20.00	2024-05-07 00:01:01.667581
84	3	Cobro Automático Diario	-20.00	2024-05-07 00:01:01.667581
85	6	Cobro Automático Diario	-20.00	2024-05-07 00:01:01.667581
86	1	Cobro Automático Diario	-20.00	2024-05-08 00:01:04.670487
87	3	Cobro Automático Diario	-20.00	2024-05-08 00:01:04.670487
88	6	Cobro Automático Diario	-20.00	2024-05-08 00:01:04.670487
89	9	primer dia	-20.00	2024-05-13 09:39:20.800598
90	10	primer dia	-20.00	2024-05-13 09:40:22.925494
91	1	Cobro Automático Diario	-20.00	2024-05-18 00:01:03.321584
92	3	Cobro Automático Diario	-20.00	2024-05-18 00:01:03.321584
93	9	Cobro Automático Diario	-20.00	2024-05-18 00:01:03.321584
94	10	Cobro Automático Diario	-20.00	2024-05-18 00:01:03.321584
96	13	primer dia	-20.00	2024-05-19 14:35:50.335998
97	3	Cobro Automático Diario	-20.00	2024-05-20 09:45:17.058298
98	9	Cobro Automático Diario	-20.00	2024-05-20 09:45:17.058298
99	10	Cobro Automático Diario	-20.00	2024-05-20 09:45:17.058298
100	13	Cobro Automático Diario	-20.00	2024-05-20 09:45:17.058298
101	3	Pago	5.00	2024-05-20 17:14:01.866343
102	14	primer dia	-20.00	2024-05-20 17:18:31.725097
103	12	Agregado desde InfoUser	2.00	2024-05-20 17:19:19.861626
104	15	Cantidad total de servicio Entrada Única: 1	20.00	2024-05-20 17:19:46.67493
105	16	primer dia	-20.00	2024-05-20 17:30:45.045536
106	17	Cantidad total de servicio Entrada Única: 1	20.00	2024-05-20 17:31:20.276879
107	16	Pago	2.00	2024-05-20 17:31:52.83429
\.


--
-- TOC entry 3649 (class 0 OID 27190)
-- Dependencies: 248
-- Data for Name: servcliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servcliente (id_cliente, id_servicio, cant, fecha_u, tipo_cliente) FROM stdin;
1	3	1	2024-04-15 09:53:01	t
1	3	1	2024-04-16 08:44:43	t
3	5	1	2024-04-16 20:23:59	t
6	4	1	2024-04-15 15:12:55	t
6	4	1	2024-04-16 14:54:11	t
6	3	6	2024-05-02 09:39:48.677825	t
1	3	1	2024-04-15 09:53:01	t
1	3	1	2024-04-16 08:44:43	t
3	5	1	2024-04-16 20:23:59	t
6	4	1	2024-04-15 15:12:55	t
6	4	1	2024-04-16 14:54:11	t
4	1	1	2024-04-14 12:11:25	t
9	1	1	2024-05-13 09:39:20.800598	t
9	2	1	2024-05-13 09:39:20.800598	t
9	3	1	2024-05-13 09:39:20.800598	t
9	4	1	2024-05-13 09:39:20.800598	t
9	5	1	2024-05-13 09:39:20.800598	t
10	1	1	2024-05-13 09:40:22.925494	t
10	2	1	2024-05-13 09:40:22.925494	t
10	3	1	2024-05-13 09:40:22.925494	t
10	4	1	2024-05-13 09:40:22.925494	t
10	5	1	2024-05-13 09:40:22.925494	t
12	1	1	2024-05-19 14:34:41.125569	f
13	1	1	2024-05-19 14:35:50.335998	t
13	2	1	2024-05-19 14:35:50.335998	t
13	3	1	2024-05-19 14:35:50.335998	t
13	4	1	2024-05-19 14:35:50.335998	t
13	5	1	2024-05-19 14:35:50.335998	t
3	1	1	2024-05-20 17:14:11.782141	t
10	1	1	2024-05-20 17:16:09.118096	t
10	2	1	2024-05-20 17:16:09.120315	t
10	3	1	2024-05-20 17:16:09.121981	t
14	1	1	2024-05-20 17:18:31.725097	t
14	2	1	2024-05-20 17:18:31.725097	t
14	3	1	2024-05-20 17:18:31.725097	t
14	4	1	2024-05-20 17:18:31.725097	t
14	5	1	2024-05-20 17:18:31.725097	t
15	3	1	2024-05-20 17:19:46.67493	f
16	1	1	2024-05-20 17:30:45.045536	t
16	2	1	2024-05-20 17:30:45.045536	t
16	3	1	2024-05-20 17:30:45.045536	t
16	4	1	2024-05-20 17:30:45.045536	t
16	5	1	2024-05-20 17:30:45.045536	t
17	2	1	2024-05-20 17:31:20.276879	f
16	3	1	2024-05-20 17:32:11.227164	t
16	3	1	2024-05-20 17:32:32.806305	t
\.


--
-- TOC entry 3650 (class 0 OID 27193)
-- Dependencies: 249
-- Data for Name: servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicio (id_servicio, nombre_s, cargo_s) FROM stdin;
1	Regadera	30.00
2	Baño	0.00
3	Desayuno	20.00
4	Comida	20.00
5	Cena	20.00
\.


--
-- TOC entry 3652 (class 0 OID 27199)
-- Dependencies: 251
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (token, id_token) FROM stdin;
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MjMyMzUyLCJleHAiOjE3MTUyMzU5NTJ9.5VOrBX9f3vmLawxR6FEOM-QE550_z8t1NGwtGmf1WQM	1
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MjMyNTI3LCJleHAiOjE3MTUyMzYxMjd9.Mr88omAypnJaE45ECy56BABcASsGve3dFgWukBj-XHw	2
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MjMyNTYwLCJleHAiOjE3MTUyMzYxNjB9.qOdOsIuA8SgK-y2Hk-ADx9gLJZEjiO9K1OvByNgRJ8g	3
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzIwOTE0LCJleHAiOjE3MTUzMjQ1MTR9.dRL_bbzVd0JZ5jrHJJUlmq1-6QRkG_9pKm_VTjiQ4Uo	4
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzI2MDU1LCJleHAiOjE3MTUzMjk2NTV9.KrZ_N-BOezi7z60a9EH6DNPxMvENCd-a3aUKkModjnQ	5
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzI2NzU0LCJleHAiOjE3MTUzMzAzNTR9.GDY0OLtLRuS8kgy-TZKRMY4JZlNlA1g546oC_Iskq_o	6
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzI4NTU1LCJleHAiOjE3MTUzMzIxNTV9.NVZBq3hDlT9iq0leGMhG2O4yArhvB4Hy9sK8TALRyAE	7
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY0OTY1LCJleHAiOjE3MTUzNjg1NjV9.PHzB7CSYzp7htVNflZdoVmYeAhJ-SGKYdWuYtZL7V4s	8
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MDE1LCJleHAiOjE3MTUzNjg2MTV9.miA8nFQXUQK-da8LefA4xVLbD__N4KkNl37KPeJg_xk	9
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MTAyLCJleHAiOjE3MTUzNjg3MDJ9.HG-nXIDy2sVv9n4ElpO9A0pWMqp2TerAa8OQHoAZZiQ	10
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MTUyLCJleHAiOjE3MTUzNjg3NTJ9.OotFKjdbmiBJ9OmKU4hiikV4gmlkk3g3U-1l2oMMgc8	11
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MTg1LCJleHAiOjE3MTUzNjg3ODV9.1vC5ocSAObillczcMBca7Xod-sIDFWNjzC_pE3wyy5E	12
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MjY5LCJleHAiOjE3MTUzNjg4Njl9.fJtM2O8q1rTNdAhvkkjEVdFOt0o4wkDVQT4CSI-xod4	13
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1MzYxLCJleHAiOjE3MTUzNjg5NjF9.aaUcCLMAuxtSymBJ9HAyI-3WyQ1lbMZxiwqM1GZqJRA	14
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1NDAyLCJleHAiOjE3MTUzNjkwMDJ9.VbFe9YwNkszaBvFVTu0IvjDmZQ6eKFUsYdep8y8C6qM	15
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1ODMxLCJleHAiOjE3MTUzNjk0MzF9.0lU3_9lGqskc_bYfcpIkMPCPymfhD9FNXNaOT_DCllE	16
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY1ODU1LCJleHAiOjE3MTUzNjk0NTV9.PkMVPZFVQOv8TvGxHt_G2Dkz7NfueR5UzuIwC_3IEKE	17
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY2MDIyLCJleHAiOjE3MTUzNjk2MjJ9.hJre4G3Z_Cf0byBLmrSDu6UAgOhlSrbSU97ZcLtr7Gw	18
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY2MjIzLCJleHAiOjE3MTUzNjk4MjN9.S8NmOtAtWzDNikUOTpKFppbrcqrJnVg4d5_gNM-fNZE	19
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY2NTg4LCJleHAiOjE3MTUzNzAxODh9.-5WKD5GJBlxt8nFWa7AGiRWKBpH-sJP624fTpBPOsSo	20
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY2NjQxLCJleHAiOjE3MTUzNzAyNDF9.0Wi8nuf51ioMZNqVCWdstxYyO56_9EWku9IQwcHp2wg	21
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY3MDE3LCJleHAiOjE3MTUzNzA2MTd9.y8bfC5YzU98Mhp9bZyFn__6U6i5at9BBOprZrBPRDEA	22
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY3MDI1LCJleHAiOjE3MTUzNzA2MjV9._Xw3AVwhkijNg9jPwDrr1o3zxR5SrFRZYjsHmW8ZRTM	23
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY3MDg1LCJleHAiOjE3MTUzNzA2ODV9.ydVrd7wQkKRmlEuVZiXJKc9lljaZPzT23o6Ousrbmdc	24
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY4OTA4LCJleHAiOjE3MTUzNzI1MDh9.Hr7G5em9tI33vayf6kUhbd1aiPltUtt53MoO5ZJnq8Y	25
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY4OTkyLCJleHAiOjE3MTUzNzI1OTJ9.W-jQnS67h3xDBkjzJhsxMvMd-6VbzCJIllDDxdJNzjM	26
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY5MDQ2LCJleHAiOjE3MTUzNzI2NDZ9.7S_HNeBeKYFZyuoABX6E6EdyjCPPRQOOLchHKURaNaI	27
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY5MTEzLCJleHAiOjE3MTUzNzI3MTN9.uhOD4VNGVdWeiyTYw9jQyXtBvAPg6-7tVyTfiFGqH58	28
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY5NDk3LCJleHAiOjE3MTUzNzMwOTd9.n_arSwYoaieIC0E5m83QnBedcqvvCcKgeAl7LwRjfd8	29
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzY5NjA0LCJleHAiOjE3MTUzNzMyMDR9.jMSq9xGPoa11xxP06KoeeMJN2exJ990qiyBTdZLDp0U	30
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzcwMjk0LCJleHAiOjE3MTUzNzM4OTR9.ccRQen03UT8jqlo1o6rZYbFvOGINekSX_H2FWtJSIfk	31
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzcwNjE5LCJleHAiOjE3MTUzNzQyMTl9.ePpiRk6kQAV4QcdulqsLnl9nx05AZsCZjZlyufbvxgk	32
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzcxMTAzLCJleHAiOjE3MTUzNzQ3MDN9.IL-5Owh947hilCDoy1EX81__6fjo0V7u_pStRe65B-4	33
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1MzcxMTM2LCJleHAiOjE3MTUzNzQ3MzZ9.v37tYFE34hQCa_MAxSsL_56UajUUMYFdVYLObUHIMPw	34
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1NTY5NDQ0LCJleHAiOjE3MTU1NzMwNDR9.8xt8To0V_EwzH15zS_1ybXI2Gvc7EoE04qDHhvEhOKw	35
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODc4MzgxLCJleHAiOjE3MTU5NjQ3ODF9.-JAmeuVtEWEFZ10t2y4Y9Fem_7pKFPtOPtiTi_TpBGg	62
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODc5ODExLCJleHAiOjE3MTU5NjYyMTF9.1B6RiZbB8tj1ekvS6IBIZ6ymZTML2Np2ChpYRVsqdOI	63
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwMzA4LCJleHAiOjE3MTU5NjY3MDh9.ZHAnq1fNmgMS1a1YNoOskLJcnP0Xw5OHZvIJw84PCWs	67
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwMzI4LCJleHAiOjE3MTU5NjY3Mjh9.8KXQ8CCaEDDRPTwMQbbupavz4GrbQ049UWsI6UkFnEQ	68
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwMzYyLCJleHAiOjE3MTU5NjY3NjJ9.kWR9gzNc0bxeROwrLUigUMfWxcuk7qsy8J7VlTl1lTE	69
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwMzk0LCJleHAiOjE3MTU5NjY3OTR9.sUzQbNMyQgp7SAufk3V5uZUtVYvYYajeic2EHBs2raE	70
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwNDQwLCJleHAiOjE3MTU5NjY4NDB9.da1XdckzUKZWZ8kvG6HWQ6dLReCPf50aDRWEpUEmvAk	71
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwNDQyLCJleHAiOjE3MTU5NjY4NDJ9._gmJ8u-Kd0F4V6hTZxmjfpiNKFotK1ydIYRl__LL9nQ	72
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwNDQ0LCJleHAiOjE3MTU5NjY4NDR9.ovUbJqM5o_9oIoUe1bawqr9OHP3qma7SM-7YCNJ_mrM	73
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwNDU1LCJleHAiOjE3MTU5NjY4NTV9.EZC4pXNnMJ9-BTBqgcixZR5A4vjk2mf4yuC5rEOjG48	74
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgwNDYxLCJleHAiOjE3MTU5NjY4NjF9.DNPCHmT9YeISsev535XVUPW0l6C9IkZJu7A1O280bow	75
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxMDE4LCJleHAiOjE3MTU5Njc0MTh9.c03pb05e1qrqaAZB5r0pYTqhsMbAfqtkGgEyXND83o4	76
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxMjI2LCJleHAiOjE3MTU5Njc2MjZ9.U8_0X5PqAIkSVmuLwtkJXwMKPhsevYojNGw7ZBml2dw	77
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxMzQzLCJleHAiOjE3MTU5Njc3NDN9.UusN2gBZERvCGaWExiwPtb2XM1qpg1BRSPZfrj3GCBg	78
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxNDI2LCJleHAiOjE3MTU5Njc4MjZ9.umaL4EIeq21b99sYNH0tv2ZJ9ClgNGMMeI_gYWABLyo	79
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxNDQ2LCJleHAiOjE3MTU5Njc4NDZ9.sWc-Z_QuYGhxUYU8sp8fddR0yPm1GT2lfhAQT1uh3LI	80
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxNzg4LCJleHAiOjE3MTU5NjgxODh9.0tCPNaoImKhiXXj37sgJL9y4u-6y5rSs9GwLW1CQtrA	81
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxODU1LCJleHAiOjE3MTU5NjgyNTV9.mBSeyCFNVcBgwZ3APSWyFg6Wasw1BVpQBHyULBF2shY	82
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgxODczLCJleHAiOjE3MTU5NjgyNzN9._pBGkPCuMwbO85buohzUFxSiieiTMJ0TuLIhQ8xIBnI	83
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgyNDUwLCJleHAiOjE3MTU5Njg4NTB9.ckhZaBGhCWRFwGOLWlPL7La_mXx2RpDmGkSM8_Wfrq0	84
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgyNjMzLCJleHAiOjE3MTU5NjkwMzN9.SqEAEIpt11CVJ4g9afdQg8EaIHkboFXMUyGeV4pbF54	85
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODgyNjg3LCJleHAiOjE3MTU5NjkwODd9.YBfEWCQ0sLApdgRdvDin_FTApHYw4ygsXWtz7RFTUjs	86
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg0MTUzLCJleHAiOjE3MTU5NzA1NTN9.2mNHHyWPmp0H7XaHpB61CgKYjFgKlhCmgLBdgYI9KkI	89
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg0NjAzLCJleHAiOjE3MTU5NzEwMDN9.XciQp_ikK9GYsS61EucECiiMB0fbPJVnS1WFPVkGdho	90
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg1MDExLCJleHAiOjE3MTU5NzE0MTF9.hVKJWFLQxdKyX7T2Z9YjtWL2XZ0JJGg19gOHwSCdmpA	91
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg1NDI3LCJleHAiOjE3MTU5NzE4Mjd9.2r2F7Hsy9jRGfTqcDQWEAjd2TmuhIAt08l5DnTlKGVo	92
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg1NDUyLCJleHAiOjE3MTU5NzE4NTJ9.7gl-r2hmkR3LOz-8909LF3IFiBrtkfQOlHxso88ypao	93
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg2NTUyLCJleHAiOjE3MTU5NzI5NTJ9.MI8CRMvzDw89qVNakEUa0Uwoe6E4waMAPSJO-hbGUgY	95
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg3MzcyLCJleHAiOjE3MTU5NzM3NzJ9.aQChZUSAM3d9PsbeXn2of96hafXTuaJtoNSY5BcNXQM	96
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg3NjU3LCJleHAiOjE3MTU5NzQwNTd9.-L2EJMl8as5EkX-ukiGz_y90ViWOQIcrTCmce-K6jlA	97
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg3OTkwLCJleHAiOjE3MTU5NzQzOTB9.IGSj1J88i8_Y3yxr3r_tfyi_Fnf6mbUMnyaJ7O1FnjI	98
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg4MDk3LCJleHAiOjE3MTU5NzQ0OTd9.DBPk66dMN33YabD0Q1FI7077_fBat3dSamXBXpY7VEc	99
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg4Mzk1LCJleHAiOjE3MTU5NzQ3OTV9.6cF966ERMDXbCCn55SL_r3mqOXHAVZP7DP2HqcULbxM	100
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg4NDIwLCJleHAiOjE3MTU5NzQ4MjB9.xXta-375xiUNoyTnFiHNfPHhV0QErOfPfrOQzMGChys	101
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODg4NDQ2LCJleHAiOjE3MTU5NzQ4NDZ9.yYD1gnzgucLBMpcLnuHtiVkRz2drKBauF7bXqkHbZzc	102
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODkxMDIxLCJleHAiOjE3MTU5Nzc0MjF9.8a_ARVptSFLz5tXH0x3Xa2HwzCE1LS8EgiyLPImJpRI	103
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODkxMDI2LCJleHAiOjE3MTU5Nzc0MjZ9.M06zIm_6eMEytDt08Wf8oZHFQevUTI6T99YywfbQ2oQ	104
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODkxMTA2LCJleHAiOjE3MTU5Nzc1MDZ9.Sbf18xLMdc1o6ejpS0SlTA6UYNc1ZW4uVl-yt5gj4KI	105
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1ODkxMjE0LCJleHAiOjE3MTU5Nzc2MTR9.cw_YvW1i7DY92NSfDVvCy2631JIFcG5FE5YAHgo-ohU	106
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTYxMTA2LCJleHAiOjE3MTYwNDc1MDZ9._allQslUjgV5Fb5rOwsrN3iBik7NehMF86XjRs7BXuU	108
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTYyNjE4LCJleHAiOjE3MTYwNDkwMTh9.BUni2CqJ_TnApKfFD1QGgMCJrbIev0u_uWaskRlPro8	109
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTYyNjIyLCJleHAiOjE3MTYwNDkwMjJ9.ORguJvX_CHQs6nVlFxEqB8rrbixfGSRSCBatZfk_Iz4	110
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY0MzM0LCJleHAiOjE3MTYwNTA3MzR9.g0JBOBq2SPmKx_3DgovNbf98uUVJO3nANiwoA2VEI1c	111
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY1NTgwLCJleHAiOjE3MTYwNTE5ODB9.AKiSTo76-CbX8JXOt7tx5Nv2HcVQc0yX5hwgBWTzYTg	112
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY3MjAxLCJleHAiOjE3MTYwNTM2MDF9.GrJFSAkvzuHZog8-rs0Vs3Ui9zLzreC_P7HZglOPkq4	113
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY3MzE1LCJleHAiOjE3MTYwNTM3MTV9._WQtsqtcbCkP5BKwg2VnFY0w42awapNGf8M6-cvkUvA	114
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY3NjAyLCJleHAiOjE3MTYwNTQwMDJ9.qzxVqkphhahdHr2bKoDnNQTSrKsDzvFXsqdZL9x6hg4	115
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUifSwiaWF0IjoxNzE1OTY5NTQzLCJleHAiOjE3MTYwNTU5NDN9.XUNtvuIWeqpgiDFgKWNW2GcpWn8n9yGVtNajvpTvm1c	116
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjUsIm5vbWJyZV91IjoiaG9saSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkNkh2dERVSG9PaVpMT2U0a050eTNZdWhVTDlBcGlsN0JRQkdaT2N4Q3hIWlVLbkFMRHlGOHUiLCJhZG1pbiI6ZmFsc2V9LCJpYXQiOjE3MTYwMTEzNDAsImV4cCI6MTcxNjA5Nzc0MH0.pCiXgEGsyi3TBCa0FN4qWZVFmutKNxgBrew4i1owu4M	120
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjUsIm5vbWJyZV91IjoiaG9saSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkNkh2dERVSG9PaVpMT2U0a050eTNZdWhVTDlBcGlsN0JRQkdaT2N4Q3hIWlVLbkFMRHlGOHUiLCJhZG1pbiI6ZmFsc2V9LCJpYXQiOjE3MTYwMTE0NjAsImV4cCI6MTcxNjA5Nzg2MH0.LBYYe92wg8s9MPWSGnxlTQNhBFgc_v6Q9MgFs1grKaM	121
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjAxMTg5NywiZXhwIjoxNzE2MDk4Mjk3fQ.Bj4tiixG6r7HAjSKbsHu9RzadDbJIherFYKsVHofvOM	125
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA2OTAzMiwiZXhwIjoxNzE2MTU1NDMyfQ.O_jf21Byvi20mZrctYhl-2AnewF93QQz1KO0q3cXu_8	126
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA2OTgwOSwiZXhwIjoxNzE2MTU2MjA5fQ.lzWWKDsPT89onE6lC_SF5S-VUSymF9PVrzrhgpv70fA	127
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA2OTk5MSwiZXhwIjoxNzE2MTU2MzkxfQ.QoWCoH-bjOu9xNQb92PHrdRGhjXJcGRMhtsa9ERqERg	128
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA2OTk5MSwiZXhwIjoxNzE2MTU2MzkxfQ.QoWCoH-bjOu9xNQb92PHrdRGhjXJcGRMhtsa9ERqERg	129
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDA3NCwiZXhwIjoxNzE2MTU2NDc0fQ.DfzwIZykvuY3box2_N1e4h5igK4eBNbi0LIZv9NExh0	130
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDE2NiwiZXhwIjoxNzE2MTU2NTY2fQ.cQEY0rmvneUWvSDdSaR5N98FI0T0KxC-jweN3wf_rkk	131
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDI2MywiZXhwIjoxNzE2MTU2NjYzfQ.o26M9QXiaf33npSwyVw53f5JZD0prYULxjzQqAE-fLw	132
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDM5MSwiZXhwIjoxNzE2MTU2NzkxfQ.l_pjIfGwe7NK6JI4lqAbFkgUl88c8VoxAk8KhL7VP0A	133
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDUwNCwiZXhwIjoxNzE2MTU2OTA0fQ.GX_PVFDG5ieNL-0xcBuoYkOhvS1Pe9ew26lu6J-oW0g	134
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDc5MSwiZXhwIjoxNzE2MTU3MTkxfQ.kiDw2CuXsvIoDbygFQfg7PosjGSVNZZPvEnXKvZBui0	135
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MDg3NiwiZXhwIjoxNzE2MTU3Mjc2fQ.toDekPI5bkEYQYxZMzXRlUWoLHGZnsWJ7gw4F_t16fw	136
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MTA5NSwiZXhwIjoxNzE2MTU3NDk1fQ.GZTyh0kdOQmGEb1TzHUblfckmAtQQ8nOcclVjdeEJ00	137
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MTE1NiwiZXhwIjoxNzE2MTU3NTU2fQ.mki_A3xA4HQWOF0gajiSRHvVjVFWPONTFVihPzR7q8s	138
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3MTI0MCwiZXhwIjoxNzE2MTU3NjQwfQ.57KaiK0SIfgTb6iC45iLtxaecQrDHi5hdUPNajbnghE	139
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3NzE4MSwiZXhwIjoxNzE2MTYzNTgxfQ.f32el3MhBsrx-fvdlLeDHzl2trEfRrvK0MH8-KDOhmo	140
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3NzMwNSwiZXhwIjoxNzE2MTYzNzA1fQ.9nlkngyEzZUwm0AFxI67RK1ys4DhINtWDXxcUhkWdv4	141
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3NzMwNSwiZXhwIjoxNzE2MTYzNzA1fQ.9nlkngyEzZUwm0AFxI67RK1ys4DhINtWDXxcUhkWdv4	142
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3ODE5MywiZXhwIjoxNzE2MTY0NTkzfQ.YTFP4kdNNiv-NDkeyJcUUIlL8gig7ru6HL4MWvrj5oA	143
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjA3ODkyNywiZXhwIjoxNzE2MTY1MzI3fQ.11Y-5ciG5s7yROnYHUGD9ah0TR46c7wapdh3VRmuFRg	146
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNjU5MywiZXhwIjoxNzE2MjIyOTkzfQ.ffZ01N61SlBmQq1KQq-9Md7jn8afOvt2fj_pE0ahBC4	147
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNzIzNCwiZXhwIjoxNzE2MjIzNjM0fQ.cTkEYSSrnTWYhA4Lhv3RLCbs_M43O4woaYDgX87Mwes	148
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNzMyNywiZXhwIjoxNzE2MjIzNzI3fQ.rXK5uly5Tf8CsXcz-LCqspAeO9TnWUanK9R2C_yLUU8	149
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNzUzOSwiZXhwIjoxNzE2MjIzOTM5fQ.NdSiV61F4ZhykSzW1nh9Dp3JfRmIeLs72deMLA5hPeI	150
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNzU4OCwiZXhwIjoxNzE2MjIzOTg4fQ.1yCoc3LLdK0sM6i5psK32fqRtAw6WFqIADp9WDKt5RI	151
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjEzNzY2OSwiZXhwIjoxNzE2MjI0MDY5fQ.ZeVEgbAnU8hJc2rQxIK1W9HpdNxxaTzNCEA9nbROjDI	152
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0MDUzNiwiZXhwIjoxNzE2MjI2OTM2fQ.V4jFMpYADugDuT6SY_Ewd2rHhfrB1QyLNosMgVsYeIw	153
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0MzI3MiwiZXhwIjoxNzE2MjI5NjcyfQ.8aor35L2_PxOFQMhnkeZS6qsVLc0F-3vKMx_6m1MSss	154
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0MzkxMywiZXhwIjoxNzE2MjMwMzEzfQ.c7v6fHoz8SyHOnwY5xaxrmgg7AyCVFQlqOhu42wnZQE	155
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0Mzk1OSwiZXhwIjoxNzE2MjMwMzU5fQ.Cr8njMCjjtWVo_pkpBwhJmWzmnycqo9U7RmF4QrQSyU	156
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0NDA5NSwiZXhwIjoxNzE2MjMwNDk1fQ.epO994UtjCZ0Upq8TDTtR5LJFe-wWMOtBWtCyQkMnlc	157
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkemE3Ykw4T0lySktTaXEub0RlMkVFdXZiRFcwU2tWSXZuZzNJRUNBUlNJdWZUdzZZU01yNmUiLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0NDI4NSwiZXhwIjoxNzE2MjMwNjg1fQ.576ngzFxTwVqT3zLvBv_Mh6IrTv2LXV3a10bGsL2ZJc	160
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkQ1N6aTJuMkFzTFdPN0lZRDRMdi5UdUEzU1ZLUE5HWG41YUNXSTEuV1QwUXpIQThIMEUwN0ciLCJhZG1pbiI6dHJ1ZX0sImlhdCI6MTcxNjE0NDc5NSwiZXhwIjoxNzE2MjMxMTk1fQ.Xtegt1qVskV0hwIZyu1TnP51igXEaPdxKyo7jQSf75c	163
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNDUwNDcsImV4cCI6MTcxNjIzMTQ0N30.A2PDGWDqtKKLBw2tDGZhrbszvYQshRt6b9OLeK6YQTc	164
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTAwOTksImV4cCI6MTcxNjIzNjQ5OX0.cX2su_BfBjMFTD9k9OZnqzd8lwNU7vjd3LJbjvmI0MU	165
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTA5MjgsImV4cCI6MTcxNjIzNzMyOH0.W_zc3KiuS88DEXs4LJjtuo05iRqGlCXz3zp-7rF90LU	168
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTI2NTgsImV4cCI6MTcxNjIzOTA1OH0.fKIIoh8zw09kJFJFYikIqC2FbhTdgLk-FVy3WMejg-8	170
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTMwMjQsImV4cCI6MTcxNjIzOTQyNH0.bYmxl5wQt0jAYIH_9ASZJT3LIh-PsRJMxRD8fLKX4QM	171
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTMyMDAsImV4cCI6MTcxNjIzOTYwMH0.jhnoqoOk6fnQ1oIYGVpVHtpYjFR_P5zsB8RXlZ15ac0	172
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYxNTM0MTQsImV4cCI6MTcxNjIzOTgxNH0.DpU8Sf8uon3DTT_mV0lH2y6HQS9OlE5vayOV_dN4JRU	173
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIyNTMxLCJleHAiOjE3MTYzMDg5MzF9.RGzio6oYzVgw-JavwYxbzwrxb4ewMPLSDR_sRUXZENo	174
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIyODY4LCJleHAiOjE3MTYzMDkyNjh9.ZT2xtK1BxU_6hBN18-7nwx-TwPSb_y43cRVQvqySN4s	175
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzMzM0LCJleHAiOjE3MTYzMDk3MzR9.dra9--1PNFLDJdle1O_e-MLMnjQw-BOfgGh8dvDYb70	176
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzMzM0LCJleHAiOjE3MTYzMDk3MzR9.dra9--1PNFLDJdle1O_e-MLMnjQw-BOfgGh8dvDYb70	177
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzNDU2LCJleHAiOjE3MTYzMDk4NTZ9.SOe5TTqt4AL1qyph3LqkIx2lsHoh7nqnIhp_OoItvas	178
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzNTY0LCJleHAiOjE3MTYzMDk5NjR9.m09COJ7Q--WErCkVODu80eWU_Fex3zA68FBSRqhgVOI	179
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzNTY0LCJleHAiOjE3MTYzMDk5NjR9.m09COJ7Q--WErCkVODu80eWU_Fex3zA68FBSRqhgVOI	180
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjIzNjg1LCJleHAiOjE3MTYzMTAwODV9.IhFO2mOX96DHihWFWH8xRlZie_0khkgCfeLinfh-1RE	181
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI0MzY3LCJleHAiOjE3MTYzMTA3Njd9.N4bl5n8UuaUNviMeR5spABL3fowtTwPzPVK5E-_9BIU	182
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI0NTYyLCJleHAiOjE3MTYzMTA5NjJ9.LcOe96pCo_V5Y29D6HUb0BsH1_HPfy3ZmO4d1GJ1yII	183
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI0ODQ5LCJleHAiOjE3MTYzMTEyNDl9.B_0MDuFP-hPvxK7bvQKINPGcyXbMjHgkYd9BBep8cLE	184
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI0OTQ4LCJleHAiOjE3MTYzMTEzNDh9.ZjAKND5rwekQOgpZddj7LMFJ2TCD2jALNPu7-vqHsj0	185
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI1MTcyLCJleHAiOjE3MTYzMTE1NzJ9.vlHDqqgE816oylh075vdMtamAEpXe2IknyA8ZvcbXAc	186
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI1MTcyLCJleHAiOjE3MTYzMTE1NzJ9.vlHDqqgE816oylh075vdMtamAEpXe2IknyA8ZvcbXAc	187
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYyMjgyNzksImV4cCI6MTcxNjMxNDY3OX0.W6HaGq6nhpuyFhRZBAhVmZ4i2FCTro67ggpKQaEN0IM	189
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI5NjA2LCJleHAiOjE3MTYzMTYwMDZ9.mxoFbTv0iSpCusMnC8U5gemTwcmPNJN_rYiRuzBSOak	190
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjYsIm5vbWJyZV91IjoiY2VzYXIxMjMiLCJjb250cmFzZW5hIjoiJDJiJDEwJFE2V09MMnpYVGkudUhxYmFwd3NJQ2VzUllQbEhPU2tnbllVUkV3YllyWFdGWXp1UTJmREZpIiwiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNzE2MjI5NjMyLCJleHAiOjE3MTYzMTYwMzJ9.B-G2YfyE5_KktCqJxRCIvf8HOZKHUHsj5F4jTnI5USo	191
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYyNDgxMDEsImV4cCI6MTcxNjMzNDUwMX0.Bf35TMXmuB78ZqkE5TA23VgsiaPl4xHf-6V7Svclx-M	197
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYyNTE1OTcsImV4cCI6MTcxNjMzNzk5N30.pLTYG4HzhKQS_JddTaWxPqYEpBEuyFuVgAI8KmJ55cs	199
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYyNjgzNTUsImV4cCI6MTcxNjM1NDc1NX0.j3plATX2wy96dD9aaQG3LsBGtdJE56BtgIu19k9SFec	200
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjMsIm5vbWJyZV91IjoiaG9sYTEyMzQiLCJjb250cmFzZW5hIjoiJDJiJDEwJENTemkybjJBc0xXTzdJWUQ0THYuVHVBM1NWS1BOR1huNWFDV0kxLldUMFF6SEE4SDBFMDdHIiwiYWRtaW4iOnRydWV9LCJpYXQiOjE3MTYyNjg0OTAsImV4cCI6MTcxNjM1NDg5MH0.CX970pmx3vcX3uw4QxrDe8-aTEJ_w1do3mL1MFARyRg	202
\.


--
-- TOC entry 3654 (class 0 OID 27205)
-- Dependencies: 253
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre_u, contrasena, admin) FROM stdin;
1	Iliana	admin134	f
2	Guardia	guardia134	f
4	jaja	$2b$10$XI4HBP9XUkBZZ9xUpGdyoOK4GuU.sqfzX2LZuFUsDk5pWrPzwLZ6q	f
5	holi	$2b$10$6HvtDUHoOiZLOe4kNty3YuhUL9Apil7BQBGZOcxCxHZUKnALDyF8u	f
3	hola1234	$2b$10$CSzi2n2AsLWO7IYD4Lv.TuA3SVKPNGXn5aCWI1.WT0QzHA8H0E07G	t
6	cesar123	$2b$10$Q6WOL2zXTi.uHqbapwsICesRYPlHOSkgnYUREwbYrXWFYzuQ2fDFi	f
\.


--
-- TOC entry 3656 (class 0 OID 27211)
-- Dependencies: 255
-- Data for Name: vetado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vetado (id_usuario, id_cliente, notas_v, fecha_v) FROM stdin;
3	6		2024-05-17 23:58:42.146261
3	4		2024-05-20 18:33:33.993435
\.


--
-- TOC entry 3657 (class 0 OID 27216)
-- Dependencies: 256
-- Data for Name: zona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zona (id_zona, nombre_z) FROM stdin;
1	Mujer
2	Hombre
3	Aislado
\.


--
-- TOC entry 3667 (class 0 OID 0)
-- Dependencies: 237
-- Name: area_id_Area_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."area_id_Area_seq"', 10, true);


--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 239
-- Name: cama_id_Cama_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."cama_id_Cama_seq"', 72, true);


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 243
-- Name: cliente_id_Cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."cliente_id_Cliente_seq"', 18, true);


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 247
-- Name: pago_id_Pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."pago_id_Pago_seq"', 109, true);


--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 250
-- Name: servicio_id_Servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."servicio_id_Servicio_seq"', 5, true);


--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 252
-- Name: tokens_id_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_id_token_seq', 202, true);


--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 254
-- Name: usuario_id_Usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."usuario_id_Usuario_seq"', 6, true);


--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 257
-- Name: zona_id_Zona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."zona_id_Zona_seq"', 3, true);


--
-- TOC entry 3463 (class 2606 OID 27224)
-- Name: area area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id_area);


--
-- TOC entry 3465 (class 2606 OID 27226)
-- Name: cama cama_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);


--
-- TOC entry 3459 (class 2606 OID 27228)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 3467 (class 2606 OID 27230)
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (carnet);


--
-- TOC entry 3461 (class 2606 OID 27232)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 3469 (class 2606 OID 27234)
-- Name: servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);


--
-- TOC entry 3471 (class 2606 OID 27236)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id_token);


--
-- TOC entry 3473 (class 2606 OID 27238)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 3475 (class 2606 OID 27240)
-- Name: zona zona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_pkey PRIMARY KEY (id_zona);


--
-- TOC entry 3489 (class 2620 OID 27241)
-- Name: huesped registrarsalida_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER registrarsalida_trigger AFTER UPDATE ON public.huesped FOR EACH ROW WHEN (((old.fecha_s IS DISTINCT FROM new.fecha_s) AND (new.fecha_s IS NOT NULL))) EXECUTE FUNCTION public.registrarsalida_func();


--
-- TOC entry 3479 (class 2606 OID 27242)
-- Name: cama fk_cama_zona; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT fk_cama_zona FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3476 (class 2606 OID 27247)
-- Name: cliente fk_cliente_paciente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_paciente FOREIGN KEY (carnet) REFERENCES public.paciente(carnet) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;


--
-- TOC entry 3477 (class 2606 OID 27252)
-- Name: cliente fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- TOC entry 3480 (class 2606 OID 27257)
-- Name: huesped fk_huesped_cama; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cama FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- TOC entry 3481 (class 2606 OID 27262)
-- Name: huesped fk_huesped_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3482 (class 2606 OID 27267)
-- Name: logsalidas fk_logSalidas_cama; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cama" FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3483 (class 2606 OID 27272)
-- Name: logsalidas fk_logSalidas_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3484 (class 2606 OID 27277)
-- Name: paciente fk_paciente_area; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_area FOREIGN KEY (id_area) REFERENCES public.area(id_area) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- TOC entry 3478 (class 2606 OID 27282)
-- Name: pago fk_pago_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3485 (class 2606 OID 27287)
-- Name: servcliente fk_servCliente_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3486 (class 2606 OID 27292)
-- Name: servcliente fk_servCliente_servicio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_servicio" FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3487 (class 2606 OID 27297)
-- Name: vetado fk_vetado_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;


--
-- TOC entry 3488 (class 2606 OID 27302)
-- Name: vetado fk_vetado_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


-- Completed on 2024-05-22 06:30:26 CST

--
-- PostgreSQL database dump complete
--

