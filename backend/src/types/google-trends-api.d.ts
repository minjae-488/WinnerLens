declare module 'google-trends-api' {
    interface TrendsOptions {
        keyword: string | string[];
        startTime?: Date;
        endTime?: Date;
        geo?: string;
        category?: number;
        resolution?: string;
    }

    const googleTrends: {
        interestOverTime(options: TrendsOptions): Promise<string>;
        relatedQueries(options: TrendsOptions): Promise<string>;
        interestByRegion(options: TrendsOptions): Promise<string>;
    };

    export default googleTrends;
}
