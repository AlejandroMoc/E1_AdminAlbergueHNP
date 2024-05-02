PGDMP  (                    |            gestionAlbergue    16.2    16.2 V    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16586    gestionAlbergue    DATABASE     �   CREATE DATABASE "gestionAlbergue" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
 !   DROP DATABASE "gestionAlbergue";
                postgres    false                        2615    17278    pgagent    SCHEMA        CREATE SCHEMA pgagent;
    DROP SCHEMA pgagent;
                postgres    false            �           0    0    SCHEMA pgagent    COMMENT     6   COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';
                   postgres    false    7                        3079    17279    pgagent 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;
    DROP EXTENSION pgagent;
                   false    7            �           0    0    EXTENSION pgagent    COMMENT     >   COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';
                        false    2            �            1255    17442    gencargodiario_proc() 	   PROCEDURE     
  CREATE PROCEDURE public.gencargodiario_proc()
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
 -   DROP PROCEDURE public.gencargodiario_proc();
       public          postgres    false            �            1255    17466 '   genservcliente_proc(integer, integer[]) 	   PROCEDURE       CREATE PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[])
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
 \   DROP PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[]);
       public          postgres    false                       1255    17789 $   getclientsbyfiltergeneral_func(text)    FUNCTION       CREATE FUNCTION public.getclientsbyfiltergeneral_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY EXECUTE
'SELECT DISTINCT cliente.id_cliente, huesped.id_cama, cliente.nombre_c, cliente.apellidos_c, huesped.fecha_i, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total
		FROM cliente
LEFT JOIN huesped ON cliente.id_cliente = huesped.id_cliente
LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
LEFT JOIN deudaClientes ON cliente.id_cliente = deudaClientes.id_cliente
		' || whereClause || '
		ORDER BY total DESC';
END;
$$;
 G   DROP FUNCTION public.getclientsbyfiltergeneral_func(whereclause text);
       public          postgres    false                       1255    17790 $   getclientsbyfilterhuesped_func(text)    FUNCTION       CREATE FUNCTION public.getclientsbyfilterhuesped_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY EXECUTE
'SELECT DISTINCT cliente.id_cliente, huesped.id_cama, cliente.nombre_c, cliente.apellidos_c, huesped.fecha_i, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total
		FROM cliente
RIGHT JOIN huesped ON cliente.id_cliente = huesped.id_cliente
LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
LEFT JOIN deudaClientes ON cliente.id_cliente = deudaClientes.id_cliente
		' || whereClause || '
		ORDER BY total DESC';
END;
$$;
 G   DROP FUNCTION public.getclientsbyfilterhuesped_func(whereclause text);
       public          postgres    false                       1255    17805 &   getclientsbyfilterservicios_func(text)    FUNCTION     q  CREATE FUNCTION public.getclientsbyfilterservicios_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, carnet character varying, desayuno bigint, comida bigint, cena bigint, l_fecha_u timestamp without time zone, nivel_se integer, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY EXECUTE
'SELECT cliente.id_cliente, nombre_c, apellidos_c, tipo_cliente, carnet,
	SUM(CASE WHEN servCliente.id_servicio = 3 THEN servCliente.cant ELSE 0 END) AS Desayuno,
    SUM(CASE WHEN servCliente.id_servicio = 4 THEN servCliente.cant ELSE 0 END) AS Comida,
    SUM(CASE WHEN servCliente.id_servicio = 5 THEN servCliente.cant ELSE 0 END) AS Cena,
	MAX(servCliente.fecha_u) AS l_fecha_u,
	nivel_se, total
FROM cliente
RIGHT JOIN servCliente ON cliente.id_cliente = servCliente.id_cliente
LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
LEFT JOIN deudaClientes ON cliente.id_cliente = deudaClientes.id_cliente
' || whereClause || '
GROUP BY cliente.id_cliente, servCliente.tipo_cliente, deudaClientes.total
ORDER BY l_fecha_u DESC';
END;
$$;
 I   DROP FUNCTION public.getclientsbyfilterservicios_func(whereclause text);
       public          postgres    false                       1255    17792 )   getclientsbyfiltervisitaprevia_func(text)    FUNCTION     a  CREATE FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, fecha_s timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY EXECUTE
'SELECT DISTINCT cliente.id_cliente, logsalidas.id_cama, cliente.nombre_c, cliente.apellidos_c, logsalidas.fecha_i, logsalidas.fecha_s, cliente.lugar_o, cliente.carnet, cliente.nivel_se, total
FROM cliente
RIGHT JOIN logsalidas ON cliente.id_cliente = logsalidas.id_cliente
LEFT JOIN vetado ON cliente.id_cliente = vetado.id_cliente
LEFT JOIN deudaClientes ON cliente.id_cliente = deudaClientes.id_cliente
' || whereClause || '
ORDER BY total DESC;';
END;
$$;
 L   DROP FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text);
       public          postgres    false            �            1255    17464    registrarsalida_func()    FUNCTION     .  CREATE FUNCTION public.registrarsalida_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO logSalidas (id_cliente, id_cama, fecha_i, fecha_s)
VALUES (OLD.id_cliente, OLD.id_cama, OLD.fecha_i, NEW.fecha_s);
DELETE FROM huesped WHERE id_cliente = OLD.id_cliente;
RETURN OLD;
END;
$$;
 -   DROP FUNCTION public.registrarsalida_func();
       public          postgres    false            �            1259    16588    area    TABLE     [   CREATE TABLE public.area (
    id_area integer NOT NULL,
    nombre_a character varying
);
    DROP TABLE public.area;
       public         heap    postgres    false            �            1259    16587    area_id_Area_seq    SEQUENCE     �   ALTER TABLE public.area ALTER COLUMN id_area ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."area_id_Area_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            �            1259    16620    cama    TABLE     P   CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_zona integer
);
    DROP TABLE public.cama;
       public         heap    postgres    false            �            1259    16619    cama_id_Cama_seq    SEQUENCE     �   ALTER TABLE public.cama ALTER COLUMN id_cama ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cama_id_Cama_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    226            �            1259    16643    cliente    TABLE     6  CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    id_usuario integer,
    carnet character varying,
    nombre_c character varying,
    apellidos_c character varying,
    lugar_o character varying,
    notas_c character varying,
    sexo boolean,
    paciente boolean,
    nivel_se integer
);
    DROP TABLE public.cliente;
       public         heap    postgres    false            �            1259    16642    cliente_id_Cliente_seq    SEQUENCE     �   ALTER TABLE public.cliente ALTER COLUMN id_cliente ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cliente_id_Cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    229            �            1259    16661    pago    TABLE     �   CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_cliente integer,
    notas_p character varying,
    monto_t numeric(7,2),
    fecha_p timestamp without time zone
);
    DROP TABLE public.pago;
       public         heap    postgres    false            �            1259    17785    deudaclientes    VIEW       CREATE VIEW public.deudaclientes AS
 SELECT cliente.id_cliente,
    abs(sum(pago.monto_t)) AS total
   FROM (public.cliente
     LEFT JOIN public.pago ON ((cliente.id_cliente = pago.id_cliente)))
  GROUP BY cliente.id_cliente
  ORDER BY (abs(sum(pago.monto_t))) DESC;
     DROP VIEW public.deudaclientes;
       public          postgres    false    231    231    229            �            1259    16688    huesped    TABLE     �   CREATE TABLE public.huesped (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.huesped;
       public         heap    postgres    false            �            1259    17274    jobs    TABLE     V   CREATE TABLE public.jobs (
    entry_job timestamp without time zone DEFAULT now()
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    17451 
   logsalidas    TABLE     �   CREATE TABLE public.logsalidas (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.logsalidas;
       public         heap    postgres    false            �            1259    16630    paciente    TABLE     �   CREATE TABLE public.paciente (
    carnet character varying NOT NULL,
    id_area integer,
    nombre_p character varying,
    apellidos_p character varying
);
    DROP TABLE public.paciente;
       public         heap    postgres    false            �            1259    16660    pago_id_Pago_seq    SEQUENCE     �   ALTER TABLE public.pago ALTER COLUMN id_pago ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."pago_id_Pago_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    231            �            1259    16701    servcliente    TABLE     �   CREATE TABLE public.servcliente (
    id_cliente integer,
    id_servicio integer,
    cant integer,
    fecha_u timestamp without time zone,
    tipo_cliente boolean
);
    DROP TABLE public.servcliente;
       public         heap    postgres    false            �            1259    16604    servicio    TABLE     }   CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre_s character varying,
    cargo_s numeric(7,2)
);
    DROP TABLE public.servicio;
       public         heap    postgres    false            �            1259    16603    servicio_id_Servicio_seq    SEQUENCE     �   ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."servicio_id_Servicio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    16612    usuario    TABLE     �   CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_u character varying,
    contrasena character varying
);
    DROP TABLE public.usuario;
       public         heap    postgres    false            �            1259    16611    usuario_id_Usuario_seq    SEQUENCE     �   ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."usuario_id_Usuario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    224            �            1259    16673    vetado    TABLE     �   CREATE TABLE public.vetado (
    id_usuario integer,
    id_cliente integer,
    notas_v character varying,
    fecha_v timestamp without time zone
);
    DROP TABLE public.vetado;
       public         heap    postgres    false            �            1259    16596    zona    TABLE     [   CREATE TABLE public.zona (
    id_zona integer NOT NULL,
    nombre_z character varying
);
    DROP TABLE public.zona;
       public         heap    postgres    false            �            1259    16595    zona_id_Zona_seq    SEQUENCE     �   ALTER TABLE public.zona ALTER COLUMN id_zona ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."zona_id_Zona_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �          0    17280    pga_jobagent 
   TABLE DATA           I   COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
    pgagent          postgres    false    236   s       �          0    17289    pga_jobclass 
   TABLE DATA           7   COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
    pgagent          postgres    false    238   %s       �          0    17299    pga_job 
   TABLE DATA           �   COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
    pgagent          postgres    false    240   Bs       �          0    17347    pga_schedule 
   TABLE DATA           �   COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
    pgagent          postgres    false    244   _s       �          0    17375    pga_exception 
   TABLE DATA           J   COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
    pgagent          postgres    false    246   |s       �          0    17389 
   pga_joblog 
   TABLE DATA           X   COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
    pgagent          postgres    false    248   �s       �          0    17323    pga_jobstep 
   TABLE DATA           �   COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
    pgagent          postgres    false    242   �s       �          0    17405    pga_jobsteplog 
   TABLE DATA           |   COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
    pgagent          postgres    false    250   �s       �          0    16588    area 
   TABLE DATA           1   COPY public.area (id_area, nombre_a) FROM stdin;
    public          postgres    false    218   �s       �          0    16620    cama 
   TABLE DATA           0   COPY public.cama (id_cama, id_zona) FROM stdin;
    public          postgres    false    226   �t       �          0    16643    cliente 
   TABLE DATA           �   COPY public.cliente (id_cliente, id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, paciente, nivel_se) FROM stdin;
    public          postgres    false    229   u       �          0    16688    huesped 
   TABLE DATA           H   COPY public.huesped (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    233   nv       �          0    17274    jobs 
   TABLE DATA           )   COPY public.jobs (entry_job) FROM stdin;
    public          postgres    false    235   �v       �          0    17451 
   logsalidas 
   TABLE DATA           K   COPY public.logsalidas (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    251   ,w       �          0    16630    paciente 
   TABLE DATA           J   COPY public.paciente (carnet, id_area, nombre_p, apellidos_p) FROM stdin;
    public          postgres    false    227   nw       �          0    16661    pago 
   TABLE DATA           N   COPY public.pago (id_pago, id_cliente, notas_p, monto_t, fecha_p) FROM stdin;
    public          postgres    false    231   4x       �          0    16701    servcliente 
   TABLE DATA           [   COPY public.servcliente (id_cliente, id_servicio, cant, fecha_u, tipo_cliente) FROM stdin;
    public          postgres    false    234   �y       �          0    16604    servicio 
   TABLE DATA           B   COPY public.servicio (id_servicio, nombre_s, cargo_s) FROM stdin;
    public          postgres    false    222   ]z       �          0    16612    usuario 
   TABLE DATA           C   COPY public.usuario (id_usuario, nombre_u, contrasena) FROM stdin;
    public          postgres    false    224   �z       �          0    16673    vetado 
   TABLE DATA           J   COPY public.vetado (id_usuario, id_cliente, notas_v, fecha_v) FROM stdin;
    public          postgres    false    232   �z       �          0    16596    zona 
   TABLE DATA           1   COPY public.zona (id_zona, nombre_z) FROM stdin;
    public          postgres    false    220   J{       �           0    0    area_id_Area_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."area_id_Area_seq"', 10, true);
          public          postgres    false    217            �           0    0    cama_id_Cama_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."cama_id_Cama_seq"', 65, true);
          public          postgres    false    225            �           0    0    cliente_id_Cliente_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."cliente_id_Cliente_seq"', 7, true);
          public          postgres    false    228            �           0    0    pago_id_Pago_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."pago_id_Pago_seq"', 74, true);
          public          postgres    false    230            �           0    0    servicio_id_Servicio_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."servicio_id_Servicio_seq"', 5, true);
          public          postgres    false    221            �           0    0    usuario_id_Usuario_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."usuario_id_Usuario_seq"', 2, true);
          public          postgres    false    223            �           0    0    zona_id_Zona_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."zona_id_Zona_seq"', 3, true);
          public          postgres    false    219            �           2606    16594    area area_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id_area);
 8   ALTER TABLE ONLY public.area DROP CONSTRAINT area_pkey;
       public            postgres    false    218            �           2606    16624    cama cama_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);
 8   ALTER TABLE ONLY public.cama DROP CONSTRAINT cama_pkey;
       public            postgres    false    226            �           2606    16649    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public            postgres    false    229            �           2606    16636    paciente paciente_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (carnet);
 @   ALTER TABLE ONLY public.paciente DROP CONSTRAINT paciente_pkey;
       public            postgres    false    227            �           2606    16667    pago pago_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);
 8   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_pkey;
       public            postgres    false    231            �           2606    16610    servicio servicio_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);
 @   ALTER TABLE ONLY public.servicio DROP CONSTRAINT servicio_pkey;
       public            postgres    false    222            �           2606    16618    usuario usuario_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    224            �           2606    16602    zona zona_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_pkey PRIMARY KEY (id_zona);
 8   ALTER TABLE ONLY public.zona DROP CONSTRAINT zona_pkey;
       public            postgres    false    220            �           2620    17465    huesped registrarsalida_trigger    TRIGGER     �   CREATE TRIGGER registrarsalida_trigger AFTER UPDATE ON public.huesped FOR EACH ROW WHEN (((old.fecha_s IS DISTINCT FROM new.fecha_s) AND (new.fecha_s IS NOT NULL))) EXECUTE FUNCTION public.registrarsalida_func();
 8   DROP TRIGGER registrarsalida_trigger ON public.huesped;
       public          postgres    false    233    254    233            �           2606    16734    cama fk_cama_zona    FK CONSTRAINT     �   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT fk_cama_zona FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.cama DROP CONSTRAINT fk_cama_zona;
       public          postgres    false    226    220    4799            �           2606    16719    cliente fk_cliente_paciente    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_paciente FOREIGN KEY (carnet) REFERENCES public.paciente(carnet) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 E   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_paciente;
       public          postgres    false    227    229    4807            �           2606    16714    cliente fk_cliente_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 D   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_usuario;
       public          postgres    false    224    4803    229            �           2606    16754    huesped fk_huesped_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cama FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 A   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cama;
       public          postgres    false    4805    233    226            �           2606    16749    huesped fk_huesped_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cliente;
       public          postgres    false    233    4809    229            �           2606    17459    logsalidas fk_logSalidas_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cama" FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama);
 I   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cama";
       public          postgres    false    4805    251    226            �           2606    17454     logsalidas fk_logSalidas_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);
 L   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cliente";
       public          postgres    false    4809    229    251            �           2606    16724    paciente fk_paciente_area    FK CONSTRAINT     �   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_area FOREIGN KEY (id_area) REFERENCES public.area(id_area) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 C   ALTER TABLE ONLY public.paciente DROP CONSTRAINT fk_paciente_area;
       public          postgres    false    218    4797    227            �           2606    16729    pago fk_pago_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 >   ALTER TABLE ONLY public.pago DROP CONSTRAINT fk_pago_cliente;
       public          postgres    false    4809    229    231            �           2606    16764 "   servcliente fk_servCliente_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 N   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_cliente";
       public          postgres    false    234    4809    229            �           2606    16759 #   servcliente fk_servCliente_servicio    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_servicio" FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_servicio";
       public          postgres    false    4801    222    234            �           2606    16744    vetado fk_vetado_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_cliente;
       public          postgres    false    229    4809    232            �           2606    16739    vetado fk_vetado_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_usuario;
       public          postgres    false    4803    224    232            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�3�t�,*M?�6�ˈ�WO�3�$�(/�˘�?/9?',c�闚V�r��)�^�����e�4�g�%r�s�&��%&gޜ�e�霟W\�S��e�X�����_�eh�Z������X����� 4�,�      �      x�˱�P��S�=#�{q�uh#M��j�;�fw�ݻˋ$�|�s�N��?�B!�B!�B�B�tU��ɐ�<���E� шF4��h�Fa�Fa�Fb����o�_D�g*�      �   M  x�U�KN�0���S�HI[X���(HEl���;86�M�,Xq�\�I��լl�����""GqD�T�H�N:o�X['+X������W�xɥ���<M�b����m�J�|����ҵ2G�6ߥ�AX̃"L��;*�y��f�z���E�Ye͗�I��!_��t$Hڜjt����2i�8@����<}��ᑮ$l��|#K�-����<���A��� b�̦��9����/������Z���zk���F���v�}vM��d�-���/��i>+�QN��](�^u��֑ã2���U�u�e���%>����{�s��9]p��c?H2��      �   F   x�M˱�0�ڞ"��E~&��s h�>l�#�;��J��/O#?�K��ʐ�)R�}�p���	      �   X   x�e��� ���HXgsƘZ�	_x��Z�����Z�]-�f��Y3n��p��v0YIX�`��lS�q����O�˫"���${      �   2   x�3�42�4202�50�54U00�25�25A��)Y��Zq��qqq �<�      �   �   x�%�M
�0����)r�D�5Ū4��q3ڠ���I�"7r��3�b��~��ݦ<���a߾�HWVE�O.�?���I�"�Ih��&<d��=!k�\%�/��� �%&�:[�f�&�5���Vˆ�z���'��ն!(9QEj!t��`q�^��La��Hl?����=���\�@�      �   �  x���O��0���)z���'v�� �fSxO�Y�J��@����#5PYO�����7�D��v����m���ta�#���	�JVE�=�~���a���䬜N��?�ϲ�7��O��̳#M�,�M����{x��r��s�5�Y9�J7 Lv6q�VX����$>?tE��ޖT��ϲ ����u{z�o_�EI�ޔz�W�AF�mY*��槓%�'{�C���2����?���ͷ��ˏ�/����n�8co�*ʼ�ʾ����^�[�+��?<̈́�F�K����#o�������;�-`������c�Xf\K����m�~}c�g��ٯ�q�K�~�����K{6c]
F�<E�<G��7�_�#�P$�?�s�����'��      �   y   x�mϻA��[�6p���©b*���&[���d�1�84�ԓ�T�{`�5�����ĞCҝ���nfе�w[Ӕ�̳l��1�jk"�}�����\�w��-�;+׆�Z\���1>��1�      �   F   x�3�JMOLI-J�46�30�2�tJ<�1��1�tI-N�,���4�p:��f�$B���Ωy0N� S`      �   -   x�3����L�K�LL���346�2�t/M,J�L�L�� �=... (xe      �   J   x�3�4���KU��K>�97?%_!Q!'�X!��Hf�^Y\���Z�id`d�k`�kh�`dheh`el����� k$      �   (   x�3��-�J-�2����M*J�2�t�,�IL������ ���     