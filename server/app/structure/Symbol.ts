interface ISymbol {
    symbol?: string;
    exchange: string;
    name?: string;
    date?: Date;
    type?: string;
    iexId?: string;
    region?: string;
    currency?: string;
    isEnabled?: boolean;
    figi?: string;
    cik?: string;
}

export default ISymbol;