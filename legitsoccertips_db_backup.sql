--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'admin',
    'customer'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_id_seq" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_id_seq" OWNED BY public."Account".id;


--
-- Name: Match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    "homeTeam" text NOT NULL,
    "homeTeamLogo" text,
    "awayTeam" text NOT NULL,
    "awayTeamLogo" text,
    league text NOT NULL,
    "leagueLogo" text,
    "matchTime" timestamp(3) without time zone NOT NULL,
    stadium text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Match" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Match_id_seq" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: NewsletterSubscriber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsletterSubscriber" (
    id integer NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NewsletterSubscriber" OWNER TO postgres;

--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NewsletterSubscriber_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NewsletterSubscriber_id_seq" OWNER TO postgres;

--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NewsletterSubscriber_id_seq" OWNED BY public."NewsletterSubscriber".id;


--
-- Name: Package; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Package" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    durations jsonb NOT NULL,
    countries text[],
    status text DEFAULT 'active'::text NOT NULL,
    subscribers integer DEFAULT 0 NOT NULL,
    revenue double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Package" OWNER TO postgres;

--
-- Name: Package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Package_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Package_id_seq" OWNER TO postgres;

--
-- Name: Package_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Package_id_seq" OWNED BY public."Package".id;


--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PasswordResetToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PasswordResetToken_id_seq" OWNER TO postgres;

--
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PasswordResetToken_id_seq" OWNED BY public."PasswordResetToken".id;


--
-- Name: Prediction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Prediction" (
    id integer NOT NULL,
    "homeTeam" text NOT NULL,
    "awayTeam" text NOT NULL,
    league text NOT NULL,
    "matchTime" timestamp(3) without time zone NOT NULL,
    prediction text NOT NULL,
    odds double precision,
    confidence integer,
    status text DEFAULT 'upcoming'::text NOT NULL,
    result text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Prediction" OWNER TO postgres;

--
-- Name: Prediction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Prediction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Prediction_id_seq" OWNER TO postgres;

--
-- Name: Prediction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Prediction_id_seq" OWNED BY public."Prediction".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id integer NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_id_seq" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;


--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMember" (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    bio text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO postgres;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TeamMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamMember_id_seq" OWNER TO postgres;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TeamMember_id_seq" OWNED BY public."TeamMember".id;


--
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Testimonial" (
    id integer NOT NULL,
    author text NOT NULL,
    rating double precision DEFAULT 5.0 NOT NULL,
    content text NOT NULL,
    source text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Testimonial" OWNER TO postgres;

--
-- Name: Testimonial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Testimonial_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Testimonial_id_seq" OWNER TO postgres;

--
-- Name: Testimonial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Testimonial_id_seq" OWNED BY public."Testimonial".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    "passwordHash" text NOT NULL,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "emailVerificationToken" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."UserRole" DEFAULT 'customer'::public."UserRole" NOT NULL,
    country text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: VIPAccessLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VIPAccessLog" (
    id integer NOT NULL,
    "subscriptionId" integer NOT NULL,
    action text NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VIPAccessLog" OWNER TO postgres;

--
-- Name: VIPAccessLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VIPAccessLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VIPAccessLog_id_seq" OWNER TO postgres;

--
-- Name: VIPAccessLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VIPAccessLog_id_seq" OWNED BY public."VIPAccessLog".id;


--
-- Name: VIPPrediction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VIPPrediction" (
    id integer NOT NULL,
    "categoryId" integer NOT NULL,
    "homeTeam" text NOT NULL,
    "awayTeam" text NOT NULL,
    league text NOT NULL,
    "matchTime" timestamp(3) without time zone NOT NULL,
    prediction text NOT NULL,
    odds double precision NOT NULL,
    analysis text NOT NULL,
    confidence integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    result text,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" integer NOT NULL,
    "publishAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "matchId" integer
);


ALTER TABLE public."VIPPrediction" OWNER TO postgres;

--
-- Name: VIPPredictionCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VIPPredictionCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "successRate" double precision DEFAULT 0 NOT NULL,
    "totalPicks" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VIPPredictionCategory" OWNER TO postgres;

--
-- Name: VIPPredictionCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VIPPredictionCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VIPPredictionCategory_id_seq" OWNER TO postgres;

--
-- Name: VIPPredictionCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VIPPredictionCategory_id_seq" OWNED BY public."VIPPredictionCategory".id;


--
-- Name: VIPPrediction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VIPPrediction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VIPPrediction_id_seq" OWNER TO postgres;

--
-- Name: VIPPrediction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VIPPrediction_id_seq" OWNED BY public."VIPPrediction".id;


--
-- Name: VIPSubscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VIPSubscription" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "packageId" integer NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "lastNotificationDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VIPSubscription" OWNER TO postgres;

--
-- Name: VIPSubscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VIPSubscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VIPSubscription_id_seq" OWNER TO postgres;

--
-- Name: VIPSubscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VIPSubscription_id_seq" OWNED BY public."VIPSubscription".id;


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN id SET DEFAULT nextval('public."Account_id_seq"'::regclass);


--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: NewsletterSubscriber id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscriber" ALTER COLUMN id SET DEFAULT nextval('public."NewsletterSubscriber_id_seq"'::regclass);


--
-- Name: Package id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Package" ALTER COLUMN id SET DEFAULT nextval('public."Package_id_seq"'::regclass);


--
-- Name: PasswordResetToken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken" ALTER COLUMN id SET DEFAULT nextval('public."PasswordResetToken_id_seq"'::regclass);


--
-- Name: Prediction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prediction" ALTER COLUMN id SET DEFAULT nextval('public."Prediction_id_seq"'::regclass);


--
-- Name: Session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- Name: TeamMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember" ALTER COLUMN id SET DEFAULT nextval('public."TeamMember_id_seq"'::regclass);


--
-- Name: Testimonial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial" ALTER COLUMN id SET DEFAULT nextval('public."Testimonial_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: VIPAccessLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPAccessLog" ALTER COLUMN id SET DEFAULT nextval('public."VIPAccessLog_id_seq"'::regclass);


--
-- Name: VIPPrediction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPrediction" ALTER COLUMN id SET DEFAULT nextval('public."VIPPrediction_id_seq"'::regclass);


--
-- Name: VIPPredictionCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPredictionCategory" ALTER COLUMN id SET DEFAULT nextval('public."VIPPredictionCategory_id_seq"'::regclass);


--
-- Name: VIPSubscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPSubscription" ALTER COLUMN id SET DEFAULT nextval('public."VIPSubscription_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Match" (id, "homeTeam", "homeTeamLogo", "awayTeam", "awayTeamLogo", league, "leagueLogo", "matchTime", stadium, "createdAt", "updatedAt") FROM stdin;
11	Arsenal	/placeholder-team.png	Chelsea	/placeholder-team.png	Premier League	/placeholder.svg	2025-07-05 22:58:54.432	Emirates Stadium	2025-07-04 22:58:54.434	2025-07-04 22:58:54.434
12	Real Madrid	/placeholder-team.png	Barcelona	/placeholder-team.png	La Liga	/placeholder.svg	2025-07-06 22:58:54.432	Santiago Bernabéu	2025-07-04 22:58:54.438	2025-07-04 22:58:54.438
13	Bayern Munich	/placeholder-team.png	Borussia Dortmund	/placeholder-team.png	Bundesliga	/placeholder.svg	2025-07-07 22:58:54.432	Allianz Arena	2025-07-04 22:58:54.441	2025-07-04 22:58:54.441
14	Juventus	/placeholder-team.png	Inter	/placeholder-team.png	Serie A	/placeholder.svg	2025-07-07 22:58:54.432	Allianz Stadium	2025-07-04 22:58:54.442	2025-07-04 22:58:54.442
15	Manchester City	/placeholder-team.png	Liverpool	/placeholder-team.png	Premier League	/placeholder.svg	2025-07-09 22:58:54.432	Etihad Stadium	2025-07-04 22:58:54.443	2025-07-04 22:58:54.443
\.


--
-- Data for Name: NewsletterSubscriber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsletterSubscriber" (id, email, "createdAt") FROM stdin;
1	test@example.com	2025-07-04 22:08:43.106
2	test2@example.com	2025-07-04 22:10:52.699
\.


--
-- Data for Name: Package; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Package" (id, name, description, durations, countries, status, subscribers, revenue, "createdAt", "updatedAt") FROM stdin;
2	Updated Test Package	A test package	{"oneMonth": {"price": 20, "enabled": true}, "twoWeeks": {"price": 10, "enabled": true}}	{US,UK}	active	0	0	2025-07-04 23:14:47.682	2025-07-04 22:15:00.382
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Prediction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prediction" (id, "homeTeam", "awayTeam", league, "matchTime", prediction, odds, confidence, status, result, "createdAt", "updatedAt") FROM stdin;
1	Arsenal	Chelsea	Premier League	2025-07-05 22:55:26.943	Home Win	1.85	85	upcoming	\N	2025-07-04 22:55:26.944	2025-07-04 22:55:26.944
2	Real Madrid	Barcelona	La Liga	2025-07-06 22:55:26.943	Draw	3.2	70	upcoming	\N	2025-07-04 22:55:26.948	2025-07-04 22:55:26.948
3	Bayern Munich	Borussia Dortmund	Bundesliga	2025-07-07 22:55:26.943	Home Win	1.65	90	upcoming	\N	2025-07-04 22:55:26.95	2025-07-04 22:55:26.95
4	Manchester City	Liverpool	Premier League	2025-07-08 22:55:26.943	Away Win	2.1	75	upcoming	\N	2025-07-04 22:55:26.951	2025-07-04 22:55:26.951
5	PSG	Marseille	Ligue 1	2025-07-09 22:55:26.943	Home Win	1.45	95	upcoming	\N	2025-07-04 22:55:26.951	2025-07-04 22:55:26.951
6	Juventus	AC Milan	Serie A	2025-07-10 22:55:26.943	Draw	3.4	65	upcoming	\N	2025-07-04 22:55:26.952	2025-07-04 22:55:26.952
7	Arsenal	Chelsea	Premier League	2025-07-05 22:58:54.443	Home Win	1.85	85	upcoming	\N	2025-07-04 22:58:54.444	2025-07-04 22:58:54.444
8	Real Madrid	Barcelona	La Liga	2025-07-06 22:58:54.443	Draw	3.2	70	upcoming	\N	2025-07-04 22:58:54.445	2025-07-04 22:58:54.445
9	Bayern Munich	Borussia Dortmund	Bundesliga	2025-07-07 22:58:54.443	Home Win	1.65	90	upcoming	\N	2025-07-04 22:58:54.446	2025-07-04 22:58:54.446
10	Manchester City	Liverpool	Premier League	2025-07-08 22:58:54.443	Away Win	2.1	75	upcoming	\N	2025-07-04 22:58:54.448	2025-07-04 22:58:54.448
11	PSG	Marseille	Ligue 1	2025-07-09 22:58:54.443	Home Win	1.45	95	upcoming	\N	2025-07-04 22:58:54.448	2025-07-04 22:58:54.448
12	Juventus	AC Milan	Serie A	2025-07-10 22:58:54.443	Draw	3.4	65	upcoming	\N	2025-07-04 22:58:54.449	2025-07-04 22:58:54.449
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMember" (id, name, role, bio, "imageUrl", "createdAt", "updatedAt") FROM stdin;
1	David Thompson	Head Analyst	Former professional footballer with 15+ years of experience in sports analysis.	/placeholder-team.png	2025-07-04 22:55:26.961	2025-07-04 22:55:26.961
2	Lisa Chen	Data Scientist	Expert in statistical modeling and machine learning for sports predictions.	/placeholder-team.png	2025-07-04 22:55:26.964	2025-07-04 22:55:26.964
3	Marcus Rodriguez	Scout	Former scout for top European clubs with extensive network in football.	/placeholder-team.png	2025-07-04 22:55:26.965	2025-07-04 22:55:26.965
4	David Thompson	Head Analyst	Former professional footballer with 15+ years of experience in sports analysis.	/placeholder-team.png	2025-07-04 22:58:54.453	2025-07-04 22:58:54.453
5	Lisa Chen	Data Scientist	Expert in statistical modeling and machine learning for sports predictions.	/placeholder-team.png	2025-07-04 22:58:54.454	2025-07-04 22:58:54.454
6	Marcus Rodriguez	Scout	Former scout for top European clubs with extensive network in football.	/placeholder-team.png	2025-07-04 22:58:54.454	2025-07-04 22:58:54.454
\.


--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Testimonial" (id, author, rating, content, source, "createdAt", "updatedAt") FROM stdin;
1	John Smith	5	Amazing predictions! I've been following for 3 months and my success rate has improved dramatically.	Trustpilot	2025-07-04 22:55:26.953	2025-07-04 22:55:26.953
2	Sarah Johnson	5	The VIP predictions are worth every penny. Highly recommend!	Google Reviews	2025-07-04 22:55:26.956	2025-07-04 22:55:26.956
3	Mike Davis	4.5	Great analysis and insights. The team really knows their football.	Direct	2025-07-04 22:55:26.958	2025-07-04 22:55:26.958
4	Emma Wilson	5	Best prediction service I've ever used. Consistent results!	Trustpilot	2025-07-04 22:55:26.96	2025-07-04 22:55:26.96
5	John Smith	5	Amazing predictions! I've been following for 3 months and my success rate has improved dramatically.	Trustpilot	2025-07-04 22:58:54.45	2025-07-04 22:58:54.45
6	Sarah Johnson	5	The VIP predictions are worth every penny. Highly recommend!	Google Reviews	2025-07-04 22:58:54.451	2025-07-04 22:58:54.451
7	Mike Davis	4.5	Great analysis and insights. The team really knows their football.	Direct	2025-07-04 22:58:54.452	2025-07-04 22:58:54.452
8	Emma Wilson	5	Best prediction service I've ever used. Consistent results!	Trustpilot	2025-07-04 22:58:54.452	2025-07-04 22:58:54.452
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "passwordHash", "isEmailVerified", "emailVerificationToken", "createdAt", "updatedAt", role, country) FROM stdin;
1	gisthive@gmail.com	Edidiong Udoh	$2b$10$1W.ST8UrHVfP0iKVYErfbu.gEfP6AGFbiXtLb6KsseolS3h2F95aW	t	b65d7ce4f3ee1c49eaa0bf947f9abbb8fe6016be2d604e1ecb1f9559ec19b58c	2025-07-04 21:24:08.793	2025-07-04 21:24:08.793	customer	NG
\.


--
-- Data for Name: VIPAccessLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VIPAccessLog" (id, "subscriptionId", action, "timestamp") FROM stdin;
\.


--
-- Data for Name: VIPPrediction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VIPPrediction" (id, "categoryId", "homeTeam", "awayTeam", league, "matchTime", prediction, odds, analysis, confidence, status, result, "isArchived", "createdAt", "updatedAt", "createdBy", "publishAt", "matchId") FROM stdin;
1	1	Manchester United	Arsenal	Premier League	2025-07-02 22:58:54.459	Home Win	2.1	United has been in great form at home this season.	85	won	2-1	f	2025-07-04 22:58:54.46	2025-07-04 22:58:54.46	1	2025-07-04 22:58:54.46	\N
2	1	Chelsea	Liverpool	Premier League	2025-07-01 22:58:54.459	Draw	3.4	Both teams are evenly matched.	75	won	1-1	f	2025-07-04 22:58:54.462	2025-07-04 22:58:54.462	1	2025-07-04 22:58:54.462	\N
3	2	Real Madrid	Barcelona	La Liga	2025-06-30 22:58:54.459	Home Win	1.95	Madrid is stronger at home.	80	won	3-1	f	2025-07-04 22:58:54.463	2025-07-04 22:58:54.463	1	2025-07-04 22:58:54.463	\N
\.


--
-- Data for Name: VIPPredictionCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VIPPredictionCategory" (id, name, slug, description, "successRate", "totalPicks", "createdAt", "updatedAt") FROM stdin;
1	Premier League	premier-league	Top tier English football predictions	78.5	45	2025-07-04 22:58:54.455	2025-07-04 22:58:54.455
2	La Liga	la-liga	Spanish league predictions	82.1	32	2025-07-04 22:58:54.458	2025-07-04 22:58:54.458
\.


--
-- Data for Name: VIPSubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VIPSubscription" (id, "userId", "packageId", "startDate", "endDate", status, "lastNotificationDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4ef5e178-5662-4a1c-9885-7d4750b69758	231dbe1eb30c13ad9cd2af88d47157d55a5f63991584a572e15ce42dbe8f9027	2025-07-04 22:21:21.323539+01	20250623212927_add_nextauth_tables	\N	\N	2025-07-04 22:21:21.208582+01	1
238623ca-46ba-4e5b-9a21-bf76c337bcc1	bed237d747786588918c5d13e768431d24a0e2f7c610a46a03345e721f12df94	2025-07-04 22:21:21.327373+01	20250624091111_add_user_role	\N	\N	2025-07-04 22:21:21.323903+01	1
99dfa8ed-3ba2-46ee-ba01-0c00d3e15a0d	241f4f86756ca92cc57b58a27ca9f617f6586e751f229b72e59a566def33a5d2	2025-07-04 22:21:21.332583+01	20250624091643_update_user_role_to_enum	\N	\N	2025-07-04 22:21:21.327671+01	1
a9c8dd4f-0b41-4884-ade4-0cba6dd0787f	c25b32df61a41c157359b2b4d9e2bdf8081a47157b6222bbfcdb4b794e2d5e28	2025-07-04 22:23:35.37911+01	20250704212335_add_country_to_user	\N	\N	2025-07-04 22:23:35.376704+01	1
3051f2ff-11a0-4b2b-81f1-191577adb119	f411280d6c596fab1104c1e91366251b79d560f830088a68cc9461303c6dfe2b	2025-07-04 23:07:38.523043+01	20250704220733_add_newsletter_subscriber	\N	\N	2025-07-04 23:07:38.510676+01	1
\.


--
-- Name: Account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_id_seq"', 1, false);


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Match_id_seq"', 15, true);


--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NewsletterSubscriber_id_seq"', 2, true);


--
-- Name: Package_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Package_id_seq"', 2, true);


--
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PasswordResetToken_id_seq"', 1, false);


--
-- Name: Prediction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Prediction_id_seq"', 12, true);


--
-- Name: Session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Session_id_seq"', 1, false);


--
-- Name: TeamMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TeamMember_id_seq"', 6, true);


--
-- Name: Testimonial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Testimonial_id_seq"', 8, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: VIPAccessLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VIPAccessLog_id_seq"', 1, false);


--
-- Name: VIPPredictionCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VIPPredictionCategory_id_seq"', 2, true);


--
-- Name: VIPPrediction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VIPPrediction_id_seq"', 3, true);


--
-- Name: VIPSubscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VIPSubscription_id_seq"', 1, false);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: NewsletterSubscriber NewsletterSubscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscriber"
    ADD CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY (id);


--
-- Name: Package Package_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Package"
    ADD CONSTRAINT "Package_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: Prediction Prediction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prediction"
    ADD CONSTRAINT "Prediction_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VIPAccessLog VIPAccessLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPAccessLog"
    ADD CONSTRAINT "VIPAccessLog_pkey" PRIMARY KEY (id);


--
-- Name: VIPPredictionCategory VIPPredictionCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPredictionCategory"
    ADD CONSTRAINT "VIPPredictionCategory_pkey" PRIMARY KEY (id);


--
-- Name: VIPPrediction VIPPrediction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPrediction"
    ADD CONSTRAINT "VIPPrediction_pkey" PRIMARY KEY (id);


--
-- Name: VIPSubscription VIPSubscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPSubscription"
    ADD CONSTRAINT "VIPSubscription_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: NewsletterSubscriber_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON public."NewsletterSubscriber" USING btree (email);


--
-- Name: PasswordResetToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON public."PasswordResetToken" USING btree (token);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VIPPredictionCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VIPPredictionCategory_slug_key" ON public."VIPPredictionCategory" USING btree (slug);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VIPAccessLog VIPAccessLog_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPAccessLog"
    ADD CONSTRAINT "VIPAccessLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public."VIPSubscription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VIPPrediction VIPPrediction_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPrediction"
    ADD CONSTRAINT "VIPPrediction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."VIPPredictionCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VIPPrediction VIPPrediction_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPPrediction"
    ADD CONSTRAINT "VIPPrediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VIPSubscription VIPSubscription_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPSubscription"
    ADD CONSTRAINT "VIPSubscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."Package"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VIPSubscription VIPSubscription_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VIPSubscription"
    ADD CONSTRAINT "VIPSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

