PGDMP  9    ;                |         	   baseLmao2    16.2    16.2 l    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    51039 	   baseLmao2    DATABASE     �   CREATE DATABASE "baseLmao2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "baseLmao2";
                postgres    false                        2615    51040    pgagent    SCHEMA        CREATE SCHEMA pgagent;
    DROP SCHEMA pgagent;
                postgres    false            �           0    0    SCHEMA pgagent    COMMENT     6   COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';
                   postgres    false    7                        3079    51041    pgagent 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;
    DROP EXTENSION pgagent;
                   false    7            �           0    0    EXTENSION pgagent    COMMENT     >   COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';
                        false    2            	           1255    51199    calcular_deuda_cliente(integer)    FUNCTION       CREATE FUNCTION public.calcular_deuda_cliente(cliente_id integer) RETURNS numeric
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
 A   DROP FUNCTION public.calcular_deuda_cliente(cliente_id integer);
       public          postgres    false                       1255    51200 )   calcular_suma_servicios_por_tipo(integer)    FUNCTION     �  CREATE FUNCTION public.calcular_suma_servicios_por_tipo(id_cliente integer) RETURNS TABLE(servicio1 integer, servicio2 integer, servicio3 integer, servicio4 integer, servicio5 integer)
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
 K   DROP FUNCTION public.calcular_suma_servicios_por_tipo(id_cliente integer);
       public          postgres    false                       1255    51201    gencargodiario_proc() 	   PROCEDURE     
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
       public          postgres    false                       1255    51202 '   genservcliente_proc(integer, integer[]) 	   PROCEDURE       CREATE PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[])
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
       public          postgres    false                       1255    51203 .   genservcliente_prochuesped(integer, integer[]) 	   PROCEDURE       CREATE PROCEDURE public.genservcliente_prochuesped(IN cliente_id integer, IN listservice integer[])
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
 c   DROP PROCEDURE public.genservcliente_prochuesped(IN cliente_id integer, IN listservice integer[]);
       public          postgres    false                       1255    51204 $   getclientsbyfiltergeneral_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfiltergeneral_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_u character varying, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
 G   DROP FUNCTION public.getclientsbyfiltergeneral_func(whereclause text);
       public          postgres    false                       1255    51205 $   getclientsbyfilterhuesped_func(text)    FUNCTION     }  CREATE FUNCTION public.getclientsbyfilterhuesped_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
 G   DROP FUNCTION public.getclientsbyfilterhuesped_func(whereclause text);
       public          postgres    false                       1255    51206 &   getclientsbyfilterservicios_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfilterservicios_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, carnet character varying, desayuno bigint, comida bigint, cena bigint, l_fecha_u timestamp without time zone, nivel_se integer, total numeric, vetado boolean)
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
 I   DROP FUNCTION public.getclientsbyfilterservicios_func(whereclause text);
       public          postgres    false                       1255    51207 )   getclientsbyfiltervisitaprevia_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, fecha_s timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
 L   DROP FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text);
       public          postgres    false                       1255    51208 }   registerhuesped_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer)    FUNCTION     g  CREATE FUNCTION public.registerhuesped_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
	DECLARE
		id_toBe INT;
		ans TEXT = 'SUCCESS';
	BEGIN
		INSERT INTO paciente(carnet, id_area, nombre_p, apellidos_p)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (carnet) DO UPDATE
        SET id_area = EXCLUDED.id_area;
		
		INSERT INTO cliente(id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
        VALUES ($5, $1, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (nombre_c, apellidos_c, lugar_o) DO UPDATE
        SET (id_usuario, carnet, notas_c, nivel_se, paciente, checked) =
        (EXCLUDED.id_usuario, EXCLUDED.carnet, EXCLUDED.notas_c, EXCLUDED.nivel_se, EXCLUDED.paciente, EXCLUDED.checked)
		RETURNING id_cliente INTO id_toBe;
        
		CALL genServCliente_procHuesped(id_toBe, ARRAY[[1, 1], [2, 1], [3, 1],[4, 1], [5, 1]]);
        INSERT INTO pago(id_cliente, notas_p, monto_t, fecha_p)
        VALUES (id_toBe, 'primer dia', -20, CURRENT_TIMESTAMP);
		
		INSERT INTO huesped(id_cliente, id_cama, fecha_i, fecha_s)
        VALUES (id_toBe, $14, CURRENT_TIMESTAMP, NULL)
        ON CONFLICT (id_cliente) DO NOTHING;
        IF NOT FOUND THEN
			ans = 'ALERTA: Cliente a registrar ya es un huésped en el albergue';
        END IF;
		
		IF EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe) THEN
			ans = 'ALERTA: Cliente a registrar está vetado del albergue';
		END IF;
		
		IF NOT EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
			AND nombre_p = $3
			AND apellidos_p = $4) THEN
			ans = 'ALERTA: El paciente a registrar no coincide con el carnet';
		END IF;
		
		IF ans = 'SUCCESS' THEN
			RAISE NOTICE 'SUCCESS';
		ELSE
			RAISE EXCEPTION 'ROLLBACK'
				USING HINT = ans;
		END IF;
		
		RETURN ans;
	END;
$_$;
 �   DROP FUNCTION public.registerhuesped_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer);
       public          postgres    false                       1255    51209 �   registervisitante_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer, integer, integer, integer, integer, integer, integer)    FUNCTION     I  CREATE FUNCTION public.registervisitante_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer, integer, integer, integer, integer, integer, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
	DECLARE
		id_toBe INT;
		ans TEXT = 'SUCCESS';
	BEGIN
		INSERT INTO paciente(carnet, id_area, nombre_p, apellidos_p)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (carnet) DO UPDATE
        SET id_area = EXCLUDED.id_area;
		
		INSERT INTO cliente(id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, nivel_se, paciente, checked)
        VALUES ($5, $1, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (nombre_c, apellidos_c, lugar_o) DO UPDATE
        SET (id_usuario, carnet, notas_c, nivel_se, paciente, checked) =
        (EXCLUDED.id_usuario, EXCLUDED.carnet, EXCLUDED.notas_c, EXCLUDED.nivel_se, EXCLUDED.paciente, EXCLUDED.checked)
		RETURNING id_cliente INTO id_toBe;
        
		CALL genServCliente_proc(id_toBe, ARRAY[[1, $14], [2, $15], [3, $16],[4, $17], [5, $18]]);
        INSERT INTO pago(id_cliente, notas_p, monto_t, fecha_p)
        VALUES (id_toBe, 'Cantidad total de servicio Entrada Única: $19', $20, CURRENT_TIMESTAMP);
		
		IF EXISTS (SELECT 1 FROM huesped WHERE id_cliente = id_toBe) THEN
			ans = 'ALERTA: Cliente a registrar ya es un huésped en el albergue';
		END IF;
		
		IF EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe) THEN
			ans = 'ALERTA: Cliente a registrar está vetado del albergue';
		END IF;
		
		IF NOT EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
			AND nombre_p = $3
			AND apellidos_p = $4) THEN
			ans = 'ALERTA: El paciente a registrar no coincide con el carnet';
		END IF;
		
		IF ans = 'SUCCESS' THEN
			RAISE NOTICE 'SUCCESS';
		ELSE
			RAISE EXCEPTION 'ROLLBACK'
				USING HINT = ans;
		END IF;
		
		RETURN ans;
	END;
$_$;
 �   DROP FUNCTION public.registervisitante_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer, integer, integer, integer, integer, integer, integer);
       public          postgres    false                       1255    51210    registrarhuesped_func()    FUNCTION     �   CREATE FUNCTION public.registrarhuesped_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE servCliente SET tipo_cliente = true WHERE id_cliente = NEW.id_cliente;
RETURN NEW;
END;
$$;
 .   DROP FUNCTION public.registrarhuesped_func();
       public          postgres    false                        1255    51211    registrarsalida_func()    FUNCTION     }  CREATE FUNCTION public.registrarsalida_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO logSalidas (id_cliente, id_cama, fecha_i, fecha_s)
VALUES (OLD.id_cliente, OLD.id_cama, OLD.fecha_i, NEW.fecha_s);
UPDATE servCliente SET tipo_cliente = false WHERE id_cliente = OLD.id_cliente;
DELETE FROM huesped WHERE id_cliente = OLD.id_cliente;
RETURN OLD;
END;
$$;
 -   DROP FUNCTION public.registrarsalida_func();
       public          postgres    false            !           1255    51212 !   veto_proc(integer, integer, text) 	   PROCEDURE     �  CREATE PROCEDURE public.veto_proc(IN id_u integer, IN id_c integer, IN n_v text)
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
 P   DROP PROCEDURE public.veto_proc(IN id_u integer, IN id_c integer, IN n_v text);
       public          postgres    false            �            1259    51213    cliente    TABLE     K  CREATE TABLE public.cliente (
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
    DROP TABLE public.cliente;
       public         heap    postgres    false            �            1259    51218    pago    TABLE     �   CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_cliente integer,
    notas_p character varying,
    monto_t numeric(7,2),
    fecha_p timestamp without time zone
);
    DROP TABLE public.pago;
       public         heap    postgres    false            �            1259    51223    deudaclientes    VIEW     �   CREATE VIEW public.deudaclientes AS
 SELECT cliente.id_cliente,
    sum(pago.monto_t) AS total
   FROM (public.cliente
     LEFT JOIN public.pago ON ((cliente.id_cliente = pago.id_cliente)))
  GROUP BY cliente.id_cliente
  ORDER BY (sum(pago.monto_t));
     DROP VIEW public.deudaclientes;
       public          postgres    false    233    232    233            �            1259    51227    absolutedeudas    VIEW     o   CREATE VIEW public.absolutedeudas AS
 SELECT id_cliente,
    abs(total) AS total
   FROM public.deudaclientes;
 !   DROP VIEW public.absolutedeudas;
       public          postgres    false    234    234            �            1259    51231    area    TABLE     [   CREATE TABLE public.area (
    id_area integer NOT NULL,
    nombre_a character varying
);
    DROP TABLE public.area;
       public         heap    postgres    false            �            1259    51236    area_id_Area_seq    SEQUENCE     �   ALTER TABLE public.area ALTER COLUMN id_area ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."area_id_Area_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    236            �            1259    51237    cama    TABLE     P   CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_zona integer
);
    DROP TABLE public.cama;
       public         heap    postgres    false            �            1259    51240    cama_id_Cama_seq    SEQUENCE     �   ALTER TABLE public.cama ALTER COLUMN id_cama ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cama_id_Cama_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    238                       1259    51394    colorescama    VIEW     -  CREATE VIEW public.colorescama AS
 SELECT id_cliente,
        CASE
            WHEN (total > (- (40)::numeric)) THEN '#7fb17f'::text
            WHEN (total <= (- (40)::numeric)) THEN '#EE7171'::text
            ELSE NULL::text
        END AS color
   FROM public.deudaclientes
  ORDER BY id_cliente;
    DROP VIEW public.colorescama;
       public          postgres    false    234    234            �            1259    51245    huesped    TABLE     �   CREATE TABLE public.huesped (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.huesped;
       public         heap    postgres    false                       1259    51398    camasgralinfo    VIEW     ?  CREATE VIEW public.camasgralinfo AS
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
     DROP VIEW public.camasgralinfo;
       public          postgres    false    238    257    257    240    240    238    232    232    232    232    234    234            �            1259    51253    cliente_id_Cliente_seq    SEQUENCE     �   ALTER TABLE public.cliente ALTER COLUMN id_cliente ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cliente_id_Cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    232            �            1259    51254    id_tobe    TABLE     8   CREATE TABLE public.id_tobe (
    id_cliente integer
);
    DROP TABLE public.id_tobe;
       public         heap    postgres    false            �            1259    51257    jobs    TABLE     V   CREATE TABLE public.jobs (
    entry_job timestamp without time zone DEFAULT now()
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    51261 
   logsalidas    TABLE     �   CREATE TABLE public.logsalidas (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.logsalidas;
       public         heap    postgres    false            �            1259    51264    paciente    TABLE     �   CREATE TABLE public.paciente (
    carnet character varying NOT NULL,
    id_area integer,
    nombre_p character varying,
    apellidos_p character varying
);
    DROP TABLE public.paciente;
       public         heap    postgres    false            �            1259    51269    pago_id_Pago_seq    SEQUENCE     �   ALTER TABLE public.pago ALTER COLUMN id_pago ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."pago_id_Pago_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    233            �            1259    51270    servcliente    TABLE     �   CREATE TABLE public.servcliente (
    id_cliente integer,
    id_servicio integer,
    cant integer,
    fecha_u timestamp without time zone,
    tipo_cliente boolean
);
    DROP TABLE public.servcliente;
       public         heap    postgres    false            �            1259    51273    servicio    TABLE     }   CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre_s character varying,
    cargo_s numeric(7,2)
);
    DROP TABLE public.servicio;
       public         heap    postgres    false            �            1259    51278    servicio_id_Servicio_seq    SEQUENCE     �   ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."servicio_id_Servicio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    248            �            1259    51279    tokens    TABLE     [   CREATE TABLE public.tokens (
    token character varying,
    id_token integer NOT NULL
);
    DROP TABLE public.tokens;
       public         heap    postgres    false            �            1259    51284    tokens_id_token_seq    SEQUENCE     �   CREATE SEQUENCE public.tokens_id_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.tokens_id_token_seq;
       public          postgres    false    250            �           0    0    tokens_id_token_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.tokens_id_token_seq OWNED BY public.tokens.id_token;
          public          postgres    false    251            �            1259    51285    usuario    TABLE     �   CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_u character varying,
    contrasena character varying,
    admin boolean
);
    DROP TABLE public.usuario;
       public         heap    postgres    false            �            1259    51290    usuario_id_Usuario_seq    SEQUENCE     �   ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."usuario_id_Usuario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    252            �            1259    51291    vetado    TABLE     �   CREATE TABLE public.vetado (
    id_usuario integer,
    id_cliente integer,
    notas_v character varying,
    fecha_v timestamp without time zone
);
    DROP TABLE public.vetado;
       public         heap    postgres    false            �            1259    51296    zona    TABLE     [   CREATE TABLE public.zona (
    id_zona integer NOT NULL,
    nombre_z character varying
);
    DROP TABLE public.zona;
       public         heap    postgres    false                        1259    51301    zona_id_Zona_seq    SEQUENCE     �   ALTER TABLE public.zona ALTER COLUMN id_zona ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."zona_id_Zona_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    255                       2604    51302    tokens id_token    DEFAULT     r   ALTER TABLE ONLY public.tokens ALTER COLUMN id_token SET DEFAULT nextval('public.tokens_id_token_seq'::regclass);
 >   ALTER TABLE public.tokens ALTER COLUMN id_token DROP DEFAULT;
       public          postgres    false    251    250            �          0    51042    pga_jobagent 
   TABLE DATA           I   COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
    pgagent          postgres    false    217   ��       �          0    51051    pga_jobclass 
   TABLE DATA           7   COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
    pgagent          postgres    false    219   ��       �          0    51061    pga_job 
   TABLE DATA           �   COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
    pgagent          postgres    false    221   Щ       �          0    51109    pga_schedule 
   TABLE DATA           �   COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
    pgagent          postgres    false    225   ��       �          0    51137    pga_exception 
   TABLE DATA           J   COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
    pgagent          postgres    false    227   
�       �          0    51151 
   pga_joblog 
   TABLE DATA           X   COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
    pgagent          postgres    false    229   '�       �          0    51085    pga_jobstep 
   TABLE DATA           �   COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
    pgagent          postgres    false    223   D�       �          0    51167    pga_jobsteplog 
   TABLE DATA           |   COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
    pgagent          postgres    false    231   a�       �          0    51231    area 
   TABLE DATA           1   COPY public.area (id_area, nombre_a) FROM stdin;
    public          postgres    false    236   ~�       �          0    51237    cama 
   TABLE DATA           0   COPY public.cama (id_cama, id_zona) FROM stdin;
    public          postgres    false    238   �       �          0    51213    cliente 
   TABLE DATA           �   COPY public.cliente (id_cliente, id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, paciente, nivel_se, checked) FROM stdin;
    public          postgres    false    232   ��       �          0    51245    huesped 
   TABLE DATA           H   COPY public.huesped (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    240   ��       �          0    51254    id_tobe 
   TABLE DATA           -   COPY public.id_tobe (id_cliente) FROM stdin;
    public          postgres    false    242   x�       �          0    51257    jobs 
   TABLE DATA           )   COPY public.jobs (entry_job) FROM stdin;
    public          postgres    false    243   ��       �          0    51261 
   logsalidas 
   TABLE DATA           K   COPY public.logsalidas (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    244   �       �          0    51264    paciente 
   TABLE DATA           J   COPY public.paciente (carnet, id_area, nombre_p, apellidos_p) FROM stdin;
    public          postgres    false    245   Ү       �          0    51218    pago 
   TABLE DATA           N   COPY public.pago (id_pago, id_cliente, notas_p, monto_t, fecha_p) FROM stdin;
    public          postgres    false    233   ��       �          0    51270    servcliente 
   TABLE DATA           [   COPY public.servcliente (id_cliente, id_servicio, cant, fecha_u, tipo_cliente) FROM stdin;
    public          postgres    false    247   ʳ       �          0    51273    servicio 
   TABLE DATA           B   COPY public.servicio (id_servicio, nombre_s, cargo_s) FROM stdin;
    public          postgres    false    248   �       �          0    51279    tokens 
   TABLE DATA           1   COPY public.tokens (token, id_token) FROM stdin;
    public          postgres    false    250   m�       �          0    51285    usuario 
   TABLE DATA           J   COPY public.usuario (id_usuario, nombre_u, contrasena, admin) FROM stdin;
    public          postgres    false    252   ��       �          0    51291    vetado 
   TABLE DATA           J   COPY public.vetado (id_usuario, id_cliente, notas_v, fecha_v) FROM stdin;
    public          postgres    false    254   X�       �          0    51296    zona 
   TABLE DATA           1   COPY public.zona (id_zona, nombre_z) FROM stdin;
    public          postgres    false    255   ��       �           0    0    area_id_Area_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."area_id_Area_seq"', 10, true);
          public          postgres    false    237            �           0    0    cama_id_Cama_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."cama_id_Cama_seq"', 79, true);
          public          postgres    false    239                        0    0    cliente_id_Cliente_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."cliente_id_Cliente_seq"', 304, true);
          public          postgres    false    241                       0    0    pago_id_Pago_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."pago_id_Pago_seq"', 321, true);
          public          postgres    false    246                       0    0    servicio_id_Servicio_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."servicio_id_Servicio_seq"', 5, true);
          public          postgres    false    249                       0    0    tokens_id_token_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tokens_id_token_seq', 224, true);
          public          postgres    false    251                       0    0    usuario_id_Usuario_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."usuario_id_Usuario_seq"', 8, true);
          public          postgres    false    253                       0    0    zona_id_Zona_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."zona_id_Zona_seq"', 3, true);
          public          postgres    false    256            -           2606    51304    area area_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id_area);
 8   ALTER TABLE ONLY public.area DROP CONSTRAINT area_pkey;
       public            postgres    false    236            /           2606    51306    cama cama_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);
 8   ALTER TABLE ONLY public.cama DROP CONSTRAINT cama_pkey;
       public            postgres    false    238            '           2606    51308    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public            postgres    false    232            )           2606    51310    cliente cliente_unique 
   CONSTRAINT     k   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_unique UNIQUE (nombre_c, apellidos_c, lugar_o);
 @   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_unique;
       public            postgres    false    232    232    232            1           2606    51312    huesped huesped_unique 
   CONSTRAINT     W   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT huesped_unique UNIQUE (id_cliente);
 @   ALTER TABLE ONLY public.huesped DROP CONSTRAINT huesped_unique;
       public            postgres    false    240            3           2606    51314    paciente paciente_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (carnet);
 @   ALTER TABLE ONLY public.paciente DROP CONSTRAINT paciente_pkey;
       public            postgres    false    245            +           2606    51316    pago pago_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);
 8   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_pkey;
       public            postgres    false    233            5           2606    51318    servicio servicio_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);
 @   ALTER TABLE ONLY public.servicio DROP CONSTRAINT servicio_pkey;
       public            postgres    false    248            7           2606    51320    tokens tokens_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id_token);
 <   ALTER TABLE ONLY public.tokens DROP CONSTRAINT tokens_pkey;
       public            postgres    false    250            9           2606    51322    usuario usuario_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    252            ;           2606    51324    zona zona_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_pkey PRIMARY KEY (id_zona);
 8   ALTER TABLE ONLY public.zona DROP CONSTRAINT zona_pkey;
       public            postgres    false    255            I           2620    51325     huesped registrarhuesped_trigger    TRIGGER     �   CREATE TRIGGER registrarhuesped_trigger AFTER INSERT ON public.huesped FOR EACH ROW EXECUTE FUNCTION public.registrarhuesped_func();
 9   DROP TRIGGER registrarhuesped_trigger ON public.huesped;
       public          postgres    false    287    240            J           2620    51326    huesped registrarsalida_trigger    TRIGGER     �   CREATE TRIGGER registrarsalida_trigger AFTER UPDATE ON public.huesped FOR EACH ROW WHEN (((old.fecha_s IS DISTINCT FROM new.fecha_s) AND (new.fecha_s IS NOT NULL))) EXECUTE FUNCTION public.registrarsalida_func();
 8   DROP TRIGGER registrarsalida_trigger ON public.huesped;
       public          postgres    false    288    240    240            ?           2606    51327    cama fk_cama_zona    FK CONSTRAINT     �   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT fk_cama_zona FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.cama DROP CONSTRAINT fk_cama_zona;
       public          postgres    false    4923    238    255            <           2606    51332    cliente fk_cliente_paciente    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_paciente FOREIGN KEY (carnet) REFERENCES public.paciente(carnet) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 E   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_paciente;
       public          postgres    false    245    4915    232            =           2606    51337    cliente fk_cliente_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 D   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_usuario;
       public          postgres    false    232    252    4921            @           2606    51342    huesped fk_huesped_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cama FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 A   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cama;
       public          postgres    false    238    240    4911            A           2606    51347    huesped fk_huesped_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cliente;
       public          postgres    false    232    240    4903            B           2606    51352    logsalidas fk_logSalidas_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cama" FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 I   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cama";
       public          postgres    false    244    4911    238            C           2606    51357     logsalidas fk_logSalidas_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 L   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cliente";
       public          postgres    false    232    244    4903            D           2606    51362    paciente fk_paciente_area    FK CONSTRAINT     �   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_area FOREIGN KEY (id_area) REFERENCES public.area(id_area) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 C   ALTER TABLE ONLY public.paciente DROP CONSTRAINT fk_paciente_area;
       public          postgres    false    4909    245    236            >           2606    51367    pago fk_pago_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 >   ALTER TABLE ONLY public.pago DROP CONSTRAINT fk_pago_cliente;
       public          postgres    false    232    4903    233            E           2606    51372 "   servcliente fk_servCliente_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 N   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_cliente";
       public          postgres    false    232    247    4903            F           2606    51377 #   servcliente fk_servCliente_servicio    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_servicio" FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_servicio";
       public          postgres    false    248    247    4917            G           2606    51382    vetado fk_vetado_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_cliente;
       public          postgres    false    4903    232    254            H           2606    51387    vetado fk_vetado_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_usuario;
       public          postgres    false    254    252    4921            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�3�t�,*M?�6�ˈ�WO�3�$�(/�˘�?/9?',c�闚V�r��)�^�����e�4�g�%r�s�&��%&gޜ�e�霟W\�S��e�X�����_�eh�Z������X����� 4�,�      �   �   x����!���iml�����Q�n	�A<��M���ܜ���{*�m�u��} A$�DI$�DI$���'�ުT�QG}�{�>*QDEQDE4�DM4�DM4��C1�Գ״���������K��ew\z�{������V0s      �   2  x�]�MN�0�דS�(���Y�VB*�(�͐:�µ�4��aɂS�b���Ɩ-K�<�y�	����X㶝qH�t�kz���%�O�Iu�g-�ڦ�k����<�����͛�bo�Aw�7Pp�*�Ar�
���x����~T�L@��������Ǚf��Df�Pq���,:`l�����<��*���]�z�k��DM�\�bR�����|�w��"U�sű0�Ei�iGMF�R:���3��X�ݙ�
�)����du��˭����G��C�\7~�Y����7I�� ��$      �   r   x�e��	�@�ᳶ
7`!�H�P���ב�����/��<���Jd��i�&{?��\��s��ؒ�3�t]� ���m��Y���r��&R�"��(Lc�ō.m�}�"�      �      x�37�����       �   ^   x����� �?U���9cL-鿎�/���GZ��X��yiN��&�A�b�$��O�!�0=(W0�An䘠`��tQ����& �N�}��f��R��HM      �   �   x�u��m1D��U\�`���뿎x#E�[%���� ���ajq*O��j;*@뎰Q��0+�e��C�6!J���$�Y>@?�>���+�v#|���RT�9\�#�����3�O�K��}��VΜ�@�M��1�=�c][va��_�/XG^�ʁ�u�X��9B��U��{sq���1� �QOS      �   �  x�}TKn�0]O��G"�t�F�E�ztCG�H�}ط�2�.r_���Q����C�9=�6��x2%I+ߞ��Q�~��ūj{H��Y���Z�M�F[�t��uqd��b��qDsWT��O[����Y�Ҧ?����mЙ�Bզp�6��r5�mԓz�uW�o���TB�}��ӻ?��}�[��V�9����@�t9�	s��@�����*����Fzg�4��DF�?� �	� )���ڑHb �7�"��ft���L�M*+�����3�\v��F��=����JK!�/2��1����u�J�k&y$�c1�i�m�5*Gn�}�ԋ?���oI�E�\�3� H����>\Ǹ���V_2�� +�,�.+*�R[ͦ�V����0w'H�玍�0R�ʜ�ӏ��5~�{�y�'�0�5|d� đ�����U��A1
�C��Ah�)��o�9�� g�y�!� 5��G�����b2�!���v�eFK�Gv���Gs:x\�4��7eo�, Z.���Ӣp���+2�
���رd0�`X¥������2�RY[aV4&͝�U�ni�%�@���,�A`K�,q���tɢh��'1s�\g�l�^e�W�l�a<�31�|�fD��4�߅�@x�i;�jL;h:?�s(D;t��P��7��_w��(      �   )  x��U���@��_� ��c�瑡	�u^N+����~��f	@`�����U�U]�a��5|9>�O�|��N(!I;����ڴ4��^�� ���{7=,�˻�8/�i^^�?�ido*�)��>�x`ڸN��6�X]E�|�nT[/�R�կ^�F��/"3���@8���dAr
w��|��y</���8����������o���4O��o�����0<���Vi�
^�o��R��j�u`���!��	�$1�J& ���6Ap�fv�2�#Z)o�jK�技8߄I�[���`���F9�_HrD��)����R�Y�9�%+�jO��+��n���"͜���u� Y��<I� �I�����cv-�}V�y�X[�X)qB0s��#.�	�΅(�%����_�Xq�r��+�+���%����.�����!�xD#o����&�
�4I�8�gٮ�w��@�;�	+L���qc�
sm���e�`η�Q�DY�s7�\��GR#���12܃�]����}�<bCq��N\�z��jᨵ�
n�߫������m��a��Ҹ�      �   =  x���K��0�ur�\ ����t���(�q;�H��d|�I)��@���A�$/����� ����$G�����6~!�j�8m�0�a��̅����v���fL�P�b?� �A���Q��lu�B�b��}��Ob G��t"��T҆�D����T��4�ax�Ȇ��b1����}ZW?w����u�:��>N���ұsȋ�J�V��'qR%jC{i[�D�J�V�gҹZ��4k�ffM��5Pf֪B�!�C�Xeb�����w�� �EYp��j��4I�`���$��IB������m�WQ� ������w���D@�_���Q2L"J�ɂ��G�v�Cz����X��p�X�ۭт���u��(i�%7���F��!6]�b�A��#�[�,V?�����5�������D�Gt�K[���r�&i�M���E�Y=Mr&��\�In���2gE�{�=���:A1v�b�%�i l~1���%�#J�G�_��䈦+�����'(OP��������V�о��x�Y��#�{��_��|���O~      �   F   x�3�JMOLI-J�46�30�2�tJ<�1��1�tI-N�,���4�p:��f�$B���Ωy0N� S`      �      x��Y��Z�{��8�<\20��j	a������~}/\�����N��΋TJYڙ�ٱ"�w�XA6)�a��F���,�z)w���N&��{�Be�'�7�UKʧ�ޣޜ���TiTZ'����+S�Ѱ\]�xCw�~�I�gk
�zs8	��ȵv_Sg'�s�f��������t���.r��}�g]�\�u]I��M�0t!x�Ony��2�E��Q�X��I��I�&���Ts��g��=����#ڟ�x-Bmm
8E3u���pߜ��oj+�?�'��}��Z��_ڍ�.'fj�J,`��M8�2l��ݦ��T��G�V�4��O����K]����C��v=!R�f���U%�Ҡ��ѳ��[
����3˃��7>�V���X�Wj���0{)��xu��mNWxM�V���v{�<�*M̽����h�������-��5kdsI�ӂD��n�zA��u����.iu6W�g��g�5~ff֗���d�w�z�T�Ok'�ZZ�)a�7��q�"����eE|$Lw���,���ѽ����8ty��l���&�V�,&Mt��F�&FX�������ѫ�+�g'�,���ܒ��ӏM�^�S�1���7� ��=TI�V�G�5^x�і�9�uͽkn�iL�ّ�FO=�Q�c�ZoPr�˔<���|�>\��Fڬ�{������3&4�A3P�k�q�S�)]�0,�}*������.n��p*Y�6N[+ʲ��<X�樻��iyB��OT�O@���<Xap���f�C�4ɜhl��K��d^��j�V@�i��zT�@�^5��Q�k�A]ᛣ�L��u%x�hܡ6Լg:g���b+�#5t�|�o �z%�_q�&��1��nO'��$f�ר?�ps�±��	��Ŭ������t=<��w3:���c�=��}şB�ȶ��i�R�W`�?RE��ko"���DԸhD7�kW'�!8&-�@;n7��O��^�'⹦9�#e��UF/��2zWk�.=��)�ߌ�=� |=���Y�;?䁋PY�@����O��-1D����-�6hqG�0���f��er�h���vi2L����+�3�4 !�o aZ��_6���;s�g^/k�pڭض�[r�)g/�R<�um}�CA����ɱ@33|A�q���m�;�~L2���l+�;eG ��iٝ�ٗ�J�+�5I�̤�K��K��8�py�B��q~���`2p"��~в9$R��
�L%<��}/z�jJM������ҔV��!��s.Q��fY���7vg��B>SI@�k[ -��~@o(��s����_�y�p�&ZaPu�ɧB��V�g*i ���^lJ�[Jf��N����r�l�i�8���^����4Y!���1�a�$i֖$-��g'�.�hOG�v�C
�容��;�j��
V�g*i �~�A��e��_W��&�y��f��F���5�fN�����T��
,��TҸƛ�@�·�iG����6��qa�=!B:U�ng���&��u�X���J��U(�2���0x��7^�g��]������.'��ݛ�c)n�N���TҸ��oʼ6K�?G���K\f2	��B�3��ɵ�d�gLC��US �3�4�W�˙ 4i�EU�}������8� b{�2MёlTh��뤡ʷ��B?RI'���@ y@Ib��B]������08������������]��c�B?RI'�^	�[��9iNfזVM�&�af�>�k���<B8v\X���8�1�>RI'#��o��	$HҲ�ƍ��1�(��L���``6����G��w+#pv��ЏT� �M��fP�{����b��őƌv�F8�ƕ�j��z�j\I�v�
�@%�;K3�� x�b�����N9 V"a�%���{��	)\��R����>PI|�is�}�T65�펵��w|Aa�LX@��)"ۭ���{锑Ӳ�|E|`�p�� 
@��`�����R�
���&dV��:���-�m`y�55��9���A�_��}��Pb�W���r͆c8�/FW�Jr�A�7������v�߭��� ��U �ݛ���[;g��������mn�h��d­ų`���� ������jԾE糞@�1��ᦺe�jGL5y�&J!��i��V�Z�_�^���SIw�ltm2󖴙ǱF=��w/� ��2A��[,��� P���.�0�g�4��iR��6�C��7��D�Z�;�P�[�к©g���V㿀�-1 <L���ަ��yD��:���/�-<�r`5Q����\�Y柀�-1�)/�{P�~��|q3��mH;�z�I[[��+�馭�-�����/@�ټrX��ϚB�Y���I9��`}U#�#6=8�&��V�Z�_�^��~Z��x}�I'�2��G���|�!8Z�C�A2��P��2�ȏ������@�tP���3�z��L��7��k�i�x�כ\��:O�lE~��P%w� D���w���+#׶wz�ýV���� ��K�o2dO���L%=j��}?h���~���t$gC��M�c9��d���6�Y�ޅ�[�n86_����G�A�3��X�9�"���S��{��
�5��ѴL���gXu����T� �˹���\��u��`S�n�R]K�Ԃ��	�8Hs,Ӂ��+�3�4��� ����;���|��~_�d�+*=a�51�7��7��Üy�1+�3����Gq4=uЉ���u/a�!D���ObN�q7��ך�4�*+"]���T� P�&I@3H�Q�n��І�A�ǥ�]q��2+M���*&5��,��T�P�o�j�40�I]�1�)8������N%�8:�G�j�Ӧ�5*�+��>SIOz����zЖ��#���9O�r:>�fN	�,Շ����i�yX{qlE}�����+� |J�Q�9�T�Ms+�����J��My���3i��[u+�3�4���� �X_�;��.I��;��D�c�e	�˷A%�ۦ�N�ʦy �����A�^���@��<Y�'��Fe��7Ag��H�,5:v�w�a_�y�&-.+�3u�r#�����<�)��⋪9��iO:HH��W�})�&��ܐ�KO-��?S��j��Y��#)�"�R7ѕ�9:ׄ7}��R�9=
��CT��g��n<A��� ��+�O@�+�dެoHq�-T5�5EC�*��X��{}4�F�EMm }�B��;� ��k�&S���3?P����Zpc�.!`C�e�k��̓��e��� �g�0���k3�һ�����HE|�;�X�_t;��Dߛڊ��2���&����(�UDP���;\���G]n�h�!��SNnwJ������?s�5���j��l,VC���PTIE:�7�ݏS��#q:��y�Ҁ�s%����0ô�.���r��]M���hxȄE��H2:��M���g�m@zB��?S(b�\�nw�&�,��"�&�������8n��=]���x��w�tM\�0j+�L��!�n�!�ظ��k�����/�sKI?�L�fwǛa�چ+��L����t����S���y���jm��ҽ�jkF�ۖ�"y�_k��	 ��Z�5^~�6H[��8b,��ۢ:�����>F�a�X�)!/'u'��֒���OBobh!bH��Y>ED�	ӝ��?R�Pͬw�ph:����D.����5��f�w�������FUK�BdUkCv�0��	���k���+l���G�i@�z���B�S�!
z.I>��>�^�M�,&\������R���'
j'xC������(n�k�*�p�ߌ���hɖ5�g�&Rľ�:��?B�(�`ҫ�M�zx61��D��9g��E67��)�����#z�qW[��v� �OT�OB�gT�����iX�C��'�q�q�,u���-��:<֑<c+��uB�6k�!�~�RX��"��#��/�~8����=3z9\�d�O�ֵ�
ԝ|x%$�����lK۹�Ě;�)eo�����="%��@�/����9pr@���4�3�+!�    �{��"�L��)�����A^��%=��-�)�yc����>Q1.���3����L��7�����z���!G��@��C��#�뤯ݞ�>Q1:K���]!�����<z׺-��H�r�^��n:�m��s/�k��H�C����c�����P��c2W���Ϯm^�b��u�$�������z\��ӟ����(F�-��CH�$,��л�k5q�¡����/<�o�d�t:�Xf���c&Z�~㩇Z�,���[E���C)�I������`o�/:˽z�g�����4'A���j��r�>6�T��Ő�cW?�����ǜ�eV�i+����W@[Nd�@ˑ��AF#CNu�����ylS/X1O��0i-;8�m��h��7�TR�p�����x�ק�����5��2�F��[a��7č����:�A[s��E.��l;O�{ca���0C������J,�M��UGf��D�SxK�AѬ�"���o�&�G��'�N�g����_�!@��Y3����vE_��p�-���s��$�;�6ߊ��I���'LS�g�j\{�l�G�̼��EZ*�A��y���tK�MQ�dciŽ�i��
P�0`��8��[��P�gP�{e��	���y�é�z��H��V�e��2V?��*�=�c��O��Ϙ	��Z�	�,1� ���s���ͧvl�:M�2�@ۑ[WC���1��5`�3��2�Ѿk��Y̀�!4�ܗ�Eϭ=Lހ�G\	y���:V�ye��Q �ؑ�g̴��L��Ϛ����f�H}K(2�\��X�nCQ	�]F����Jz;��O���Ϙ�û|tے�6�h��/3]]Cc�>.Am��2:�y���C�|�H��,yg�X=�.�����/�a�E󘓻KWmlO�]/���>d�R~�X&p�oj �U�R�>�w2~����P��V��Uڄ��W�|����%�� �	�7q��5���Й
�N��3K�9&����&u6���4h���� 3~g:�i�٩.#L2}C��*mK�����;�W��"�T�� �ɐ�ZP�2�'�q��l��;��0�T�c�%捗J�HݝW�s^������̺�/5��"Y�j�����O5㥹A�7�h��-�I�z��鲂���c��1��%���>�0��p�q�	���S���}~?&nQ�i�f?��Vf?����z� ҝz�N�#�:���_�R
�6q]�Q����ۃ�TL��[�_�7��`������,� ���m�xRn���,�H�r,�H�!n����C\����τY���8����g�c�:�{2��ּ�i-%�3�������`�em�}&,���Y��U��7 ۾�?(L-z�R�Cij`�%�|O�ڐ}��}&<g<��ͅٯ�y�o�G3�Α�}2�U�ڵLf���w��.�Tץ ���f��r�������]z,ba1������[T9Z'9S;I3Me�b��+����3ެM�ɱ�L�%AU5�B�F�x�mQ�x���@��Uf�����_�����f�&� ��83O��٥
%An�(oa���T���P`���2*~a�#�� ظ�G�d��ţ{X%jm����8�D"7�8�X؜T��i���< f?B�f˛"^�-���st*��P\E��h��V��,��k�	$��~��q�5�u����z|�gڠ�¢��'��e��I2�C���x;�9�L�'���(2�CS �~�>����f�ϸu�4���w�ںe�B9���<%���I�̛iO.`�3| ��o�i�e��s�6k���{Ņ��^)�w��*b�|͸�����Z;7	`�3| `&co�U9��s$��,���]tV{�����oN��{�a��T$T 3���>3�Ë�����N����---q7u�مC�p��`p��{�lM��5�t(��̒wq6j�3���,��W��=�X��s��p��x����BV�}$�ٟ���0i��<Su@p(9�s�����
��/aP��N�t�6�ƽ3��#O�X�}f.�/�T�j���(� `6ϊ�J2���o�c+��(�_��e�`���Q�5Ǆt�b�����}�U��󛰸��̮��ā6�lK�������o�0���/���č=�����G��D��k���9��AwɾJQU9T�	�aP�?YA�>p�V����7$�ˏ�ݖ��xa�a�R�/����3:�k�&Ґ�����8yya�8�a��q+˗����Q����"
'��z-z�kY����Gg��u��F��7��I��il���C�RD3v�8�*�]g)�h��Q��1S���y���M����\0,��Uq�\/FM�&|����zҽ*ъv�ܱ��oB�������
�\>.Ƿ.e�����<�����L�6����Tǀ��~�	^��7{y2���( Dkڹ�M�H�bN␢�b���6�y����C�xn��A�L��n�}��r������;��Aқo�|�G ���t���6������q	f/�J��x���x��A۩6oE���CA� r�E��{�|��:4 WO��n��A��fG7"
V��5yƵ3��C4ahbyf�l� ��"H�5��7��r�.���^��.���6lD�ZS�sek�8曂J{>8�K��-��G��-���CX���r��,#B�w��cT�:��^kyD�N���z��62.򽏗��[T𿈜��9\�@̝ �3�\�}��՞�?((��H�FtfJdm�Z�!r����'��=#��E����Y[� x����@Nƞ&x�,|ї��j�2����s��X�aK �~���א��9@ߐC�e6���L�����R�,�kVE����ɼ󶸰�hVJ���������H�����oQ#����D 4OH�b;	���qBÓ���F�'yY�?�C@o��I���� ���u���-y�ͭ��6ɴ?h���AJ�l�R���֟�! �1_=�s���!*f���m�j���0M+R�Dq8�U�=�u��
��3��_C&��j��ྑ��5(��LM�x�j����>C��<1T�'�=� r?�C�Nr����d���k\��@h���r�R���}Lba�,Sx�+�sn���vkƂ� ���0���~�`x��;����Pi�ܣ����yvr���=����Yۈ��{޹�o"��Y��ܲX��	���G���]�����HIF��\Pp��������9[�@x<_��}�.� �+{DqG۟,I��Z�A��+�]���qMx��'͸���H���9���� �\+
}��l0i.��)i�����B�
 �=�����I����d����ʁ�w����	�:��
m��#�D)OǱ�AՎ��SE�	�����i[̒�Gǅ�}��
�~굀���ԋ��$ԞF�O��c����g�:v%��TXk�r �YV}�1P}SO k��<��#�kK
~�v�1*+�;�Fr�fḪ5'>mY���dY��G�}�^&�i�k�4*n��p������8��K�O��b��#��)�1@�YV��g�w�[V@���e
��{Y�'Q	M7F�ջ>�%�0ם�s!���X��� �dY����e�r���v�V1�c��G$n��� �%#wk×n��K�YK�����W� ����9�V �S�z����ZR"E��h�n8~K��c�,��E� ��Ƥy8o�]p?��	~������,o/�&�Jn����|0��N��-��vd*��ib
L����c�?G��o��=s�2���3����e�߸�[�&�W1A�CE;{������i�
�����:p5����卋X��-�ʎ���w�{�6RP_��K�9��E��~�_�˅��_0�ɑů
�x41a?aD_�O�9V*�.�h�5i���`�g6�8�ѱ��|Ъ�~5X^�3-~�?Dd�s����b̽��D�I�㷙zL1�.n������9���'���]*-�� @  .4Y@�I�|-f��q�o�$�{�Gaq��ssݓ1(tH�_����N�`٨����^﹜Gw�Z�@fG�3�"5�$�	6��Z'�1���[p�\s= c��������JJ~�#��//�)(�Q�{*�e���an�6b1$`)Rp��>4Uu���ӐQN��N�b6���E�<7m����)b}������׻# Բ#���>��2�w�sy�M�8�p'�c]����U]��d�TA�6� ��#�Px,��F�`��R#xW�E����֖�i�_�솄�0;�b��e��k" p?GΡ:/��K{�r���K{���tĆ�w���r� �����]r%tb�sH%��j�{Ʋ�[�գ��s�}Nl�s���uS�w7i}09!i�
?��cR�J͞ .���s ���h���;o�U��3�?���i}s�B&m=f���z5<El�����-0 �c�\>.���D ��@� p��n%�E$�$�mt���Q`ֶ�@if=x}C<Ȉ�~���7g�
��ß2��к�s�f�&�c��p��e��J�o���=[�@UE��������?���>�      �   �  x�=�ɒ�@��s��v�Ȣ#Ӏ�V̥P��M��雙n����/�H8��Ԓ�%P2�)����u��_0X	���V�#A��Ҩ6�^��>M���l�í�S�EtV-_��?�.Rn�"��o�[Q��aE��r�B�?���*r5�J�yǗ��(�u�kM�5]�ya	����L�N�7�T'�$�ɆT�����N�f��lr��5�6�j���c1��B��@I<W�Ӑ��r|�,�}�7�;��.���1��i��f��%K�
p~<�zK���|��r��hT��]L���6�r��*SL&W�yM�aR��5�ȥo�������O^�q��Py��z�}��N��Ql��7��1� �����K�_�a�O
�       �   g   x�3�4�4�t,,=�V�,Q!'Q�(����<�����Ԓ|=N##]S]#3C+Cs+C=csssKC.cNCs� ���FV&fV��z&�&�\1z\\\ u��      �   (   x�3��-�J-�2����M*J�2�t�,�IL������ ���     