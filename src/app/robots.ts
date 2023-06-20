import config from '@/utils/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/studio/',
            ],
        },
        sitemap: config.sitemaps,
    };
}