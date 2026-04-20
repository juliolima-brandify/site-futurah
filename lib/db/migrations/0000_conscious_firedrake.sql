CREATE TABLE "analise_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analise_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"tipo" text DEFAULT 'express' NOT NULL,
	"status" text DEFAULT 'pendente_dados' NOT NULL,
	"instagram_handle" text NOT NULL,
	"email" text NOT NULL,
	"nome" text,
	"whatsapp" text,
	"objetivo" text,
	"monetiza_hoje" text,
	"tempo_disponivel" text,
	"dados_scraped" jsonb,
	"conteudo" jsonb,
	"revisor_notas" text,
	"pago" boolean DEFAULT false NOT NULL,
	"stripe_session_id" text,
	"published_at" timestamp with time zone,
	"first_viewed_at" timestamp with time zone,
	"last_viewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analises_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"social" text,
	"origem" text DEFAULT 'contact_form',
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analise_eventos" ADD CONSTRAINT "analise_eventos_analise_id_analises_id_fk" FOREIGN KEY ("analise_id") REFERENCES "public"."analises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analise_eventos_analise_idx" ON "analise_eventos" USING btree ("analise_id");--> statement-breakpoint
CREATE INDEX "analises_status_idx" ON "analises" USING btree ("status");--> statement-breakpoint
CREATE INDEX "analises_email_idx" ON "analises" USING btree ("email");--> statement-breakpoint
CREATE INDEX "analises_instagram_idx" ON "analises" USING btree ("instagram_handle");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");