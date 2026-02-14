// Aa component partner logos nu infinite slider display kare chhe (fade edges sathe)
// This component displays an infinite scrolling partner logo cloud with progressive blur edges
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import Image from 'next/image'


export default function LogoCloud() {
    return (
        <section className="bg-background overflow-hidden py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Our Valued Partners</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/nvidia/000000"
                                    alt="Nvidia Logo"
                                    height={20}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/googlecloud/000000"
                                    alt="Column Logo"
                                    height={16}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/github/000000"
                                    alt="GitHub Logo"
                                    height={16}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/nike/000000"
                                    alt="Nike Logo"
                                    height={20}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/lemonsqueezy/000000"
                                    alt="Lemon Squeezy Logo"
                                    height={20}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/laravel/000000"
                                    alt="Laravel Logo"
                                    height={16}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/vercel/000000"
                                    alt="Lilly Logo"
                                    height={28}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://cdn.simpleicons.org/openai/000000"
                                    alt="OpenAI Logo"
                                    height={24}
                                    width={100}
                                    style={{ width: 'auto' }}
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}