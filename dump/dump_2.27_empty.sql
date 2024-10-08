PGDMP  !    (    
            |            gestionAlbergueVacio    16.2    16.2 l    Z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            [           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            \           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ]           1262    36212    gestionAlbergueVacio    DATABASE     �   CREATE DATABASE "gestionAlbergueVacio" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
 &   DROP DATABASE "gestionAlbergueVacio";
                postgres    false                        2615    36213    pgagent    SCHEMA        CREATE SCHEMA pgagent;
    DROP SCHEMA pgagent;
                postgres    false            ^           0    0    SCHEMA pgagent    COMMENT     6   COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';
                   postgres    false    7                        3079    36214    pgagent 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;
    DROP EXTENSION pgagent;
                   false    7            _           0    0    EXTENSION pgagent    COMMENT     >   COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';
                        false    2            	           1255    36372    calcular_deuda_cliente(integer)    FUNCTION       CREATE FUNCTION public.calcular_deuda_cliente(cliente_id integer) RETURNS numeric
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
       public          postgres    false                       1255    36373 )   calcular_suma_servicios_por_tipo(integer)    FUNCTION     �  CREATE FUNCTION public.calcular_suma_servicios_por_tipo(id_cliente integer) RETURNS TABLE(servicio1 integer, servicio2 integer, servicio3 integer, servicio4 integer, servicio5 integer)
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
       public          postgres    false                       1255    36374    gencargodiario_proc() 	   PROCEDURE     
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
       public          postgres    false                       1255    36375 '   genservcliente_proc(integer, integer[]) 	   PROCEDURE       CREATE PROCEDURE public.genservcliente_proc(IN cliente_id integer, IN listservice integer[])
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
       public          postgres    false                       1255    36376 .   genservcliente_prochuesped(integer, integer[]) 	   PROCEDURE       CREATE PROCEDURE public.genservcliente_prochuesped(IN cliente_id integer, IN listservice integer[])
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
       public          postgres    false                       1255    36377 $   getclientsbyfiltergeneral_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfiltergeneral_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_u character varying, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
       public          postgres    false                       1255    36378 $   getclientsbyfilterhuesped_func(text)    FUNCTION     }  CREATE FUNCTION public.getclientsbyfilterhuesped_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
       public          postgres    false                       1255    36379 &   getclientsbyfilterservicios_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfilterservicios_func(whereclause text) RETURNS TABLE(id_cliente integer, nombre_c character varying, apellidos_c character varying, tipo_cliente boolean, carnet character varying, desayuno bigint, comida bigint, cena bigint, l_fecha_u timestamp without time zone, nivel_se integer, total numeric, vetado boolean)
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
       public          postgres    false                       1255    36380 )   getclientsbyfiltervisitaprevia_func(text)    FUNCTION     �  CREATE FUNCTION public.getclientsbyfiltervisitaprevia_func(whereclause text) RETURNS TABLE(id_cliente integer, id_cama integer, nombre_c character varying, apellidos_c character varying, fecha_i timestamp without time zone, fecha_s timestamp without time zone, lugar_o character varying, carnet character varying, nivel_se integer, total numeric, vetado boolean)
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
       public          postgres    false                       1255    36381 }   registerhuesped_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer)    FUNCTION     j  CREATE FUNCTION public.registerhuesped_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer) RETURNS text
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
			ans = 'ALERTA: Cliente a registrar ya es un huésped en el albergue.';
        END IF;
		
		IF EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe) THEN
			ans = 'ALERTA: Cliente a registrar está vetado del albergue.';
		END IF;
		
		IF NOT EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
			AND nombre_p = $3
			AND apellidos_p = $4) THEN
			ans = 'ALERTA: El paciente a registrar no coincide con el carnet.';
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
       public          postgres    false                       1255    36382 �   registervisitante_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer, integer, integer, integer, integer, integer, integer)    FUNCTION     L  CREATE FUNCTION public.registervisitante_func(text, integer, text, text, integer, text, text, text, text, boolean, integer, boolean, boolean, integer, integer, integer, integer, integer, integer, integer) RETURNS text
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
			ans = 'ALERTA: Cliente a registrar ya es un huésped en el albergue.';
		END IF;
		
		IF EXISTS (SELECT 1 FROM vetado WHERE id_cliente = id_toBe) THEN
			ans = 'ALERTA: Cliente a registrar está vetado del albergue.';
		END IF;
		
		IF NOT EXISTS (SELECT 1 FROM paciente WHERE carnet = $1
			AND nombre_p = $3
			AND apellidos_p = $4) THEN
			ans = 'ALERTA: El paciente a registrar no coincide con el carnet.';
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
       public          postgres    false                       1255    36383    registrarhuesped_func()    FUNCTION     �   CREATE FUNCTION public.registrarhuesped_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE servCliente SET tipo_cliente = true WHERE id_cliente = NEW.id_cliente;
RETURN NEW;
END;
$$;
 .   DROP FUNCTION public.registrarhuesped_func();
       public          postgres    false                        1255    36384    registrarsalida_func()    FUNCTION     }  CREATE FUNCTION public.registrarsalida_func() RETURNS trigger
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
       public          postgres    false            !           1255    36385 !   veto_proc(integer, integer, text) 	   PROCEDURE     �  CREATE PROCEDURE public.veto_proc(IN id_u integer, IN id_c integer, IN n_v text)
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
       public          postgres    false            �            1259    36386    cliente    TABLE     K  CREATE TABLE public.cliente (
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
       public         heap    postgres    false            �            1259    36391    pago    TABLE     �   CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_cliente integer,
    notas_p character varying,
    monto_t numeric(7,2),
    fecha_p timestamp without time zone
);
    DROP TABLE public.pago;
       public         heap    postgres    false            �            1259    36396    deudaclientes    VIEW     �   CREATE VIEW public.deudaclientes AS
 SELECT cliente.id_cliente,
    sum(pago.monto_t) AS total
   FROM (public.cliente
     LEFT JOIN public.pago ON ((cliente.id_cliente = pago.id_cliente)))
  GROUP BY cliente.id_cliente
  ORDER BY (sum(pago.monto_t));
     DROP VIEW public.deudaclientes;
       public          postgres    false    233    232    233            �            1259    36400    absolutedeudas    VIEW     o   CREATE VIEW public.absolutedeudas AS
 SELECT id_cliente,
    abs(total) AS total
   FROM public.deudaclientes;
 !   DROP VIEW public.absolutedeudas;
       public          postgres    false    234    234            �            1259    36404    area    TABLE     [   CREATE TABLE public.area (
    id_area integer NOT NULL,
    nombre_a character varying
);
    DROP TABLE public.area;
       public         heap    postgres    false            �            1259    36409    area_id_Area_seq    SEQUENCE     �   ALTER TABLE public.area ALTER COLUMN id_area ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."area_id_Area_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    236            �            1259    36410    cama    TABLE     P   CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_zona integer
);
    DROP TABLE public.cama;
       public         heap    postgres    false            �            1259    36413    cama_id_Cama_seq    SEQUENCE     �   ALTER TABLE public.cama ALTER COLUMN id_cama ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cama_id_Cama_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    238                       1259    36566    colorescama    VIEW     -  CREATE VIEW public.colorescama AS
 SELECT id_cliente,
        CASE
            WHEN (total > (- (40)::numeric)) THEN '#7fb17f'::text
            WHEN (total <= (- (40)::numeric)) THEN '#EE7171'::text
            ELSE NULL::text
        END AS color
   FROM public.deudaclientes
  ORDER BY id_cliente;
    DROP VIEW public.colorescama;
       public          postgres    false    234    234            �            1259    36418    huesped    TABLE     �   CREATE TABLE public.huesped (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.huesped;
       public         heap    postgres    false                       1259    36570    camasgralinfo    VIEW     ?  CREATE VIEW public.camasgralinfo AS
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
       public          postgres    false    238    257    257    240    240    238    232    232    232    232    234    234            �            1259    36426    cliente_id_Cliente_seq    SEQUENCE     �   ALTER TABLE public.cliente ALTER COLUMN id_cliente ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."cliente_id_Cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    232            �            1259    36427    id_tobe    TABLE     8   CREATE TABLE public.id_tobe (
    id_cliente integer
);
    DROP TABLE public.id_tobe;
       public         heap    postgres    false            �            1259    36430    jobs    TABLE     V   CREATE TABLE public.jobs (
    entry_job timestamp without time zone DEFAULT now()
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    36434 
   logsalidas    TABLE     �   CREATE TABLE public.logsalidas (
    id_cliente integer,
    id_cama integer,
    fecha_i timestamp without time zone,
    fecha_s timestamp without time zone
);
    DROP TABLE public.logsalidas;
       public         heap    postgres    false            �            1259    36437    paciente    TABLE     �   CREATE TABLE public.paciente (
    carnet character varying NOT NULL,
    id_area integer,
    nombre_p character varying,
    apellidos_p character varying
);
    DROP TABLE public.paciente;
       public         heap    postgres    false            �            1259    36442    pago_id_Pago_seq    SEQUENCE     �   ALTER TABLE public.pago ALTER COLUMN id_pago ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."pago_id_Pago_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    233            �            1259    36443    servcliente    TABLE     �   CREATE TABLE public.servcliente (
    id_cliente integer,
    id_servicio integer,
    cant integer,
    fecha_u timestamp without time zone,
    tipo_cliente boolean
);
    DROP TABLE public.servcliente;
       public         heap    postgres    false            �            1259    36446    servicio    TABLE     }   CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre_s character varying,
    cargo_s numeric(7,2)
);
    DROP TABLE public.servicio;
       public         heap    postgres    false            �            1259    36451    servicio_id_Servicio_seq    SEQUENCE     �   ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."servicio_id_Servicio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    248            �            1259    36452    tokens    TABLE     [   CREATE TABLE public.tokens (
    token character varying,
    id_token integer NOT NULL
);
    DROP TABLE public.tokens;
       public         heap    postgres    false            �            1259    36457    tokens_id_token_seq    SEQUENCE     �   CREATE SEQUENCE public.tokens_id_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.tokens_id_token_seq;
       public          postgres    false    250            `           0    0    tokens_id_token_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.tokens_id_token_seq OWNED BY public.tokens.id_token;
          public          postgres    false    251            �            1259    36458    usuario    TABLE     �   CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_u character varying,
    contrasena character varying,
    admin boolean
);
    DROP TABLE public.usuario;
       public         heap    postgres    false            �            1259    36463    usuario_id_Usuario_seq    SEQUENCE     �   ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."usuario_id_Usuario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    252            �            1259    36464    vetado    TABLE     �   CREATE TABLE public.vetado (
    id_usuario integer,
    id_cliente integer,
    notas_v character varying,
    fecha_v timestamp without time zone
);
    DROP TABLE public.vetado;
       public         heap    postgres    false            �            1259    36469    zona    TABLE     [   CREATE TABLE public.zona (
    id_zona integer NOT NULL,
    nombre_z character varying
);
    DROP TABLE public.zona;
       public         heap    postgres    false                        1259    36474    zona_id_Zona_seq    SEQUENCE     �   ALTER TABLE public.zona ALTER COLUMN id_zona ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."zona_id_Zona_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    255            f           2604    36475    tokens id_token    DEFAULT     r   ALTER TABLE ONLY public.tokens ALTER COLUMN id_token SET DEFAULT nextval('public.tokens_id_token_seq'::regclass);
 >   ALTER TABLE public.tokens ALTER COLUMN id_token DROP DEFAULT;
       public          postgres    false    251    250            ?          0    36215    pga_jobagent 
   TABLE DATA           I   COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
    pgagent          postgres    false    217   ��       @          0    36224    pga_jobclass 
   TABLE DATA           7   COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
    pgagent          postgres    false    219   ֩       A          0    36234    pga_job 
   TABLE DATA           �   COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
    pgagent          postgres    false    221   �       C          0    36282    pga_schedule 
   TABLE DATA           �   COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
    pgagent          postgres    false    225   �       D          0    36310    pga_exception 
   TABLE DATA           J   COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
    pgagent          postgres    false    227   -�       E          0    36324 
   pga_joblog 
   TABLE DATA           X   COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
    pgagent          postgres    false    229   J�       B          0    36258    pga_jobstep 
   TABLE DATA           �   COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
    pgagent          postgres    false    223   g�       F          0    36340    pga_jobsteplog 
   TABLE DATA           |   COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
    pgagent          postgres    false    231   ��       C          0    36404    area 
   TABLE DATA           1   COPY public.area (id_area, nombre_a) FROM stdin;
    public          postgres    false    236   ��       E          0    36410    cama 
   TABLE DATA           0   COPY public.cama (id_cama, id_zona) FROM stdin;
    public          postgres    false    238   3�       A          0    36386    cliente 
   TABLE DATA           �   COPY public.cliente (id_cliente, id_usuario, carnet, nombre_c, apellidos_c, lugar_o, notas_c, sexo, paciente, nivel_se, checked) FROM stdin;
    public          postgres    false    232   ��       G          0    36418    huesped 
   TABLE DATA           H   COPY public.huesped (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    240   ֫       I          0    36427    id_tobe 
   TABLE DATA           -   COPY public.id_tobe (id_cliente) FROM stdin;
    public          postgres    false    242   �       J          0    36430    jobs 
   TABLE DATA           )   COPY public.jobs (entry_job) FROM stdin;
    public          postgres    false    243   �       K          0    36434 
   logsalidas 
   TABLE DATA           K   COPY public.logsalidas (id_cliente, id_cama, fecha_i, fecha_s) FROM stdin;
    public          postgres    false    244   0�       L          0    36437    paciente 
   TABLE DATA           J   COPY public.paciente (carnet, id_area, nombre_p, apellidos_p) FROM stdin;
    public          postgres    false    245   M�       B          0    36391    pago 
   TABLE DATA           N   COPY public.pago (id_pago, id_cliente, notas_p, monto_t, fecha_p) FROM stdin;
    public          postgres    false    233   j�       N          0    36443    servcliente 
   TABLE DATA           [   COPY public.servcliente (id_cliente, id_servicio, cant, fecha_u, tipo_cliente) FROM stdin;
    public          postgres    false    247   ��       O          0    36446    servicio 
   TABLE DATA           B   COPY public.servicio (id_servicio, nombre_s, cargo_s) FROM stdin;
    public          postgres    false    248   ��       Q          0    36452    tokens 
   TABLE DATA           1   COPY public.tokens (token, id_token) FROM stdin;
    public          postgres    false    250   ��       S          0    36458    usuario 
   TABLE DATA           J   COPY public.usuario (id_usuario, nombre_u, contrasena, admin) FROM stdin;
    public          postgres    false    252   %�       U          0    36464    vetado 
   TABLE DATA           J   COPY public.vetado (id_usuario, id_cliente, notas_v, fecha_v) FROM stdin;
    public          postgres    false    254   ��       V          0    36469    zona 
   TABLE DATA           1   COPY public.zona (id_zona, nombre_z) FROM stdin;
    public          postgres    false    255   ��       a           0    0    area_id_Area_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."area_id_Area_seq"', 10, true);
          public          postgres    false    237            b           0    0    cama_id_Cama_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."cama_id_Cama_seq"', 59, true);
          public          postgres    false    239            c           0    0    cliente_id_Cliente_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."cliente_id_Cliente_seq"', 310, true);
          public          postgres    false    241            d           0    0    pago_id_Pago_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."pago_id_Pago_seq"', 329, true);
          public          postgres    false    246            e           0    0    servicio_id_Servicio_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."servicio_id_Servicio_seq"', 5, true);
          public          postgres    false    249            f           0    0    tokens_id_token_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tokens_id_token_seq', 234, true);
          public          postgres    false    251            g           0    0    usuario_id_Usuario_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."usuario_id_Usuario_seq"', 9, true);
          public          postgres    false    253            h           0    0    zona_id_Zona_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."zona_id_Zona_seq"', 3, true);
          public          postgres    false    256            �           2606    36477    area area_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id_area);
 8   ALTER TABLE ONLY public.area DROP CONSTRAINT area_pkey;
       public            postgres    false    236            �           2606    36479    cama cama_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);
 8   ALTER TABLE ONLY public.cama DROP CONSTRAINT cama_pkey;
       public            postgres    false    238            �           2606    36481    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public            postgres    false    232            �           2606    36483    cliente cliente_unique 
   CONSTRAINT     k   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_unique UNIQUE (nombre_c, apellidos_c, lugar_o);
 @   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_unique;
       public            postgres    false    232    232    232            �           2606    36485    huesped huesped_unique 
   CONSTRAINT     W   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT huesped_unique UNIQUE (id_cliente);
 @   ALTER TABLE ONLY public.huesped DROP CONSTRAINT huesped_unique;
       public            postgres    false    240            �           2606    36487    paciente paciente_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (carnet);
 @   ALTER TABLE ONLY public.paciente DROP CONSTRAINT paciente_pkey;
       public            postgres    false    245            �           2606    36489    pago pago_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);
 8   ALTER TABLE ONLY public.pago DROP CONSTRAINT pago_pkey;
       public            postgres    false    233            �           2606    36491    servicio servicio_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);
 @   ALTER TABLE ONLY public.servicio DROP CONSTRAINT servicio_pkey;
       public            postgres    false    248            �           2606    36493    tokens tokens_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id_token);
 <   ALTER TABLE ONLY public.tokens DROP CONSTRAINT tokens_pkey;
       public            postgres    false    250            �           2606    36495    usuario usuario_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    252            �           2606    36497    zona zona_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_pkey PRIMARY KEY (id_zona);
 8   ALTER TABLE ONLY public.zona DROP CONSTRAINT zona_pkey;
       public            postgres    false    255            �           2620    36498     huesped registrarhuesped_trigger    TRIGGER     �   CREATE TRIGGER registrarhuesped_trigger AFTER INSERT ON public.huesped FOR EACH ROW EXECUTE FUNCTION public.registrarhuesped_func();
 9   DROP TRIGGER registrarhuesped_trigger ON public.huesped;
       public          postgres    false    287    240            �           2620    36499    huesped registrarsalida_trigger    TRIGGER     �   CREATE TRIGGER registrarsalida_trigger AFTER UPDATE ON public.huesped FOR EACH ROW WHEN (((old.fecha_s IS DISTINCT FROM new.fecha_s) AND (new.fecha_s IS NOT NULL))) EXECUTE FUNCTION public.registrarsalida_func();
 8   DROP TRIGGER registrarsalida_trigger ON public.huesped;
       public          postgres    false    288    240    240            �           2606    36500    cama fk_cama_zona    FK CONSTRAINT     �   ALTER TABLE ONLY public.cama
    ADD CONSTRAINT fk_cama_zona FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.cama DROP CONSTRAINT fk_cama_zona;
       public          postgres    false    3486    238    255            �           2606    36505    cliente fk_cliente_paciente    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_paciente FOREIGN KEY (carnet) REFERENCES public.paciente(carnet) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 E   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_paciente;
       public          postgres    false    245    3478    232            �           2606    36510    cliente fk_cliente_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 D   ALTER TABLE ONLY public.cliente DROP CONSTRAINT fk_cliente_usuario;
       public          postgres    false    232    252    3484            �           2606    36515    huesped fk_huesped_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cama FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 A   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cama;
       public          postgres    false    238    240    3474            �           2606    36520    huesped fk_huesped_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT fk_huesped_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.huesped DROP CONSTRAINT fk_huesped_cliente;
       public          postgres    false    232    240    3466            �           2606    36525    logsalidas fk_logSalidas_cama    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cama" FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 I   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cama";
       public          postgres    false    244    3474    238            �           2606    36530     logsalidas fk_logSalidas_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.logsalidas
    ADD CONSTRAINT "fk_logSalidas_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 L   ALTER TABLE ONLY public.logsalidas DROP CONSTRAINT "fk_logSalidas_cliente";
       public          postgres    false    232    244    3466            �           2606    36535    paciente fk_paciente_area    FK CONSTRAINT     �   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_area FOREIGN KEY (id_area) REFERENCES public.area(id_area) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 C   ALTER TABLE ONLY public.paciente DROP CONSTRAINT fk_paciente_area;
       public          postgres    false    3472    245    236            �           2606    36540    pago fk_pago_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.pago
    ADD CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 >   ALTER TABLE ONLY public.pago DROP CONSTRAINT fk_pago_cliente;
       public          postgres    false    232    3466    233            �           2606    36545 "   servcliente fk_servCliente_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_cliente" FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 N   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_cliente";
       public          postgres    false    232    247    3466            �           2606    36550 #   servcliente fk_servCliente_servicio    FK CONSTRAINT     �   ALTER TABLE ONLY public.servcliente
    ADD CONSTRAINT "fk_servCliente_servicio" FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.servcliente DROP CONSTRAINT "fk_servCliente_servicio";
       public          postgres    false    248    247    3480            �           2606    36555    vetado fk_vetado_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_cliente;
       public          postgres    false    3466    232    254            �           2606    36560    vetado fk_vetado_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.vetado
    ADD CONSTRAINT fk_vetado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 B   ALTER TABLE ONLY public.vetado DROP CONSTRAINT fk_vetado_usuario;
       public          postgres    false    254    252    3484            ?      x������ � �      @      x������ � �      A      x������ � �      C      x������ � �      D      x������ � �      E      x������ � �      B      x������ � �      F      x������ � �      C   �   x�3�t�,*M?�6�ˈ�WO�3�$�(/�˘�?/9?',c�闚V�r��)�^�����e�4�g�%r�s�&��%&gޜ�e�霟W\�S��e�X�����_�eh�Z������X����� 4�,�      E   v   x�˻�P�����>���:�	4���g9�Y��l�������+��-��/�Fa�Fa�F��D�G&)�d�M��z���(D!
Q�B4��hD#����M�����&�      A      x������ � �      G      x������ � �      I      x�37�����       J      x������ � �      K      x������ � �      L      x������ � �      B      x������ � �      N      x������ � �      O   F   x�3�JMOLI-J�46�30�2�tJ<�1��1�tI-N�,���4�p:��f�$B���Ωy0N� S`      Q     x���K��0 ���_�
/���+qyZ[5%��Tf������;�<�)]��_uWJ��ܡ�cF#��=<���]o�>/���tKxjy��c��☬������<A��l.���}Z�>{۠&�5@O�xH���L4�uC	�y�
�i8(�|��5vcK$�K�H��$�~k���boY��4ll.d7�%�pLT�Q$�>���ԟ��f�i��k�>��!���kS�D�}/���9]ߧ���-}�"���P� �W�K���/����瀫6�;���<j،Fr�N�}������v��jZ��Vf�����'��EV�S�b��W�9/�Vܿx�����|��#�OxT���7E��&�h����3���?pX�M��	��f�V�}K� ���-��Zߦ���k��V�� �q�S�I?O�����g�A�ԡ����a縻�6,l)_�~|��
v���	Ny*8���'ܸV�̝A,5�f�ʘ�� ����^d��n����H���>E����f�߲�l�      S   W   x�3����I4426�T1JR14Pq��4�3r,�	�7��t1�)�)u4��s��3Mt�4�1��p��0p50w�,����� ay�      U      x������ � �      V   (   x�3��-�J-�2����M*J�2�t�,�IL������ ���     