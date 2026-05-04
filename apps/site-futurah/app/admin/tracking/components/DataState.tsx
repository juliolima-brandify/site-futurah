type Props = {
    status: "empty" | "error" | "loading";
    message?: string;
    hint?: string;
};

const DEFAULT_MESSAGES: Record<Props["status"], string> = {
    empty: "Sem dados para esta janela.",
    error: "Falha ao carregar dados.",
    loading: "Carregando...",
};

export function DataState({ status, message, hint }: Props) {
    return (
        <div className="trk-state" data-tone={status}>
            <div>{message ?? DEFAULT_MESSAGES[status]}</div>
            {hint ? <div className="trk-state-hint">{hint}</div> : null}
        </div>
    );
}
