import React, { cache } from 'react'
import client from '@/utils/sanity-client';
import { groq } from 'next-sanity';
import { BlogData } from '@/app/(admin)/admin/dashboard/blogs/page';
import Content from '@/components/editor/content';
import Stars from '@/components/stars';
import style from './style.module.scss'
import formatDate from '@/utils/date';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa'

const clientFetch = cache(client.fetch.bind(client));

export default async function page({
    params
}: {
    params: {
        slug: string;
    };
}) {
    return (
        <div className={``}>
            <header className={`relative w-full pb-[11%] bg-[var(--tertiary-color)] `}>
                <div className={`absolute h-full w-[90%] bottom-auto right-auto hidden md:block`}>
                    <div className={`absolute top-0 left-0 h-full w-full`}>
                        <Stars />
                    </div>
                </div>

                <div className={`relative z-20 px-6 py-10 pt-24 md:max-w-5xl mx-auto`}>
                    <h1 className={`md:max-w-[100%] text-4xl text-center md:text-left leading-tight font-semibold text-[var(--dark-text-color)] md:text-current`}>React Native Course</h1>

                    <p className={`md:max-w-[100%] mt-2 text-center md:text-left text-[var(--text-color)]`}>
                        Start a career as a Cloud Technology Consultant . In this program, you’ll learn in-demand skills to advise clients on the use of cloud technology to meet business objectives. No degree or experience required
                    </p>

                    <p className={`md:max-w-[50%] text-center md:text-left text-[var(--text-color)]`}>
                        <span key={0} className={`inline-block px-2 py-1 mt-2 mr-2 text-xs font-semibold rounded-md bg-[var(--bg-color)] text-[var(--text-color)]`}>
                            Begginner Friendly
                        </span>
                        <span key={0} className={`inline-block px-2 py-1 mt-2 mr-2 text-xs font-semibold rounded-md bg-[var(--bg-color)] text-[var(--text-color)]`}>
                            With Certificate
                        </span>
                    </p>

                    <div className={`flex items-center justify-center md:justify-start mt-4`}>
                        <div className={`flex items-center`}>
                            <img
                                className={`w-10 h-10 rounded-full`}
                                src={"https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"}
                                alt={""}
                            />
                        </div>
                        <div className={`ml-2`}>
                            <b className={`text-xs text-[var(--text-color)]`}>
                                Akash Srinivasan
                            </b>
                            <p className={`text-xs leading-3 text-[var(--text-color)]`}>
                                & 5+ more Instructors
                            </p>
                        </div>
                        <Link href={`#`} className={style['load_more_btn']}>
                            <div>
                                <span>Enroll Now</span>
                            </div>

                            <div>
                                <FaArrowRight className={`inline-block ml-2`} />
                            </div>
                        </Link>
                    </div>

                </div>

                <div className={`absolute w-full -bottom-2 z-30`}>
                    

                    <svg
                        preserveAspectRatio="xMinYMin meet"
                        className={`w-full block`}
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 375 50"
                    >
                        <defs></defs>
                        <path className={`fill-[var(--bg-color)]`} fillRule="evenodd" d="M376 .414V50H0V5.48C141.126 31.757 266.126 30.182 375 .756l1-.342z"></path>
                    </svg>
                </div>
            </header>

            <div className={style.courseInfo}>
                <ul className={style.filter}>
                    <li className={style.filterText}>About</li>
                    <li className={style.filterText}>Outcomes</li>
                    <li className={style.filterText}>Courses</li>
                    <li className={style.filterText}>Testimonials</li>
                </ul>
            </div>
        </div>
    )
}

/**
 * Generating meta data for the page
 */
type MetaDataProps = {
    params: { slug: string };
};

export async function generateMetadata({ params }: MetaDataProps): Promise<Metadata> {
    const { slug } = params;

    const data = (await clientFetch<BlogData[]>(groq`*[_type == "blogs" && slug.current == "${slug}" && is_published == true] {
        _id,
        title,
        description,
        "image": image.asset->url,
        "slug": slug.current,
        is_published,
        time_to_read,
        "content": custom_content,
        _createdAt,
        _updatedAt,
        author->{
            ...,
            "image": image.asset->url,
            "slug": slug.current,
        },
        tags
    }`))[0];

    if (data) {
        return {
            title: data.title,
            description: data.description,
            authors: [
                {
                    name: data.author.name,
                    url: data.author.url,
                }
            ],
            assets: [data.image],
            openGraph: {
                type: 'article',
                title: data.title,
                description: data.description,
                images: [data.image],
                authors: [data.author.name, data.author.url],
                url: `https://www.growitrapid.com/blogs/${data.slug}`,
                tags: data.tags,
                section: 'Blogs',
            },
            twitter: {
                site: '@site',
                card: 'summary_large_image',
                title: data.title,
                description: data.description,
                images: [data.image],
            },
            appleWebApp: {
                title: data.title,
            },
        }
    } else {
        return {
            title: 'Grow It Rapid',
            description: 'Grow It Rapid',
        }
    }
}
