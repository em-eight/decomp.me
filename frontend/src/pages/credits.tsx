import { GetStaticProps } from "next"

import Link from "next/link"

import Footer from "../components/Footer"
import Nav from "../components/Nav"
import UserLink, { GitHubUserLink } from "../components/user/UserLink"
import * as api from "../lib/api"

import styles from "./credits.module.scss"

const MAINTAINER_USERNAMES = ["nanaian", "ethteck"]
const CONTRIBUTOR_USERNAMES = [
    "zbanks",
    "simonlindholm",
    "mkst",
    "FluentCoding",
    "TGEnigma",
    "octorock",
    "JoshDuMan",
    "Henny022",
    "AngheloAlf",
    "EpochFlame",
    "SeekyCt",
    "Trevor89",
    "MegaMech",
]

type Contributor = {
    type: "decompme"
    user: api.User
} | {
    type: "github"
    user: { login: string, avatar_url?: string }
}

async function getContributor(username: string): Promise<Contributor> {
    try {
        // Try and get decomp.me information if they have an account
        const user: api.User = await api.get(`/users/${username}`)
        return {
            type: "decompme",
            user,
        }
    } catch (error) {
        // Fall back to GitHub information
        const req = await fetch(`https://api.github.com/users/${username}`)
        const user = await req.json()

        if (user.message) {
            // Rate limit :(
            return {
                type: "github",
                user: { login: username },
            }
        }

        return {
            type: "github",
            user,
        }
    }
}

function Contributor({ contributor }: { contributor: Contributor }) {
    if (contributor.type === "decompme")
        return <UserLink user={contributor.user} />
    else
        return <GitHubUserLink user={contributor.user} />
}

export const getStaticProps: GetStaticProps = async _context => {
    return {
        props: {
            maintainers: await Promise.all(MAINTAINER_USERNAMES.map(getContributor)),
            contributors: await Promise.all(CONTRIBUTOR_USERNAMES.map(getContributor)),
        },
    }
}

export default function CreditsPage({ maintainers, contributors }: {
    maintainers: Contributor[]
    contributors: Contributor[]
}) {
    return <>
        <Nav />
        <main>
            <div className={styles.container}>
                <h1 className={styles.heading}>
                    Credits
                </h1>

                <p>
                    decomp.me is developed by <Contributor contributor={maintainers[0]} /> and <Contributor contributor={maintainers[1]} />.
                </p>

                <div>
                    <h3 className={styles.subheading}>
                        Contributors
                    </h3>
                    <ul className={styles.contributors}>
                        {contributors.map(contributor => {
                            return <li key={contributor.type === "decompme" ? contributor.user.username : contributor.user.login}>
                                <Contributor contributor={contributor} />
                            </li>
                        })}
                    </ul>
                </div>

                <hr className={styles.rule} />

                <div>
                    <h3 className={styles.subheading}>
                        Projects
                    </h3>
                    <ul>
                        <li>
                            <Link href="https://github.com/simonlindholm/asm-differ">
                                <a>simonlindholm/asm-differ</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://github.com/matt-kempster/m2c">
                                <a>matt-kempster/m2c</a>
                            </Link>
                        </li>
                    </ul>
                </div>

                <hr className={styles.rule} />

                <div>
                    <h3 className={styles.subheading}>
                        Icons
                    </h3>
                    <ul>
                        <li>Octicons by GitHub</li>
                        <li>
                            <Link href="https://github.com/file-icons/icons">
                                <a>file-icons/icons</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://github.com/coreui/coreui-icons">
                                <a>coreui/coreui-icons</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://www.deviantart.com/maxigamer/art/FONT-New-Fontendo-23DSi-Lite-XL-DOWNLOAD-ZIP-552834059">
                                <a>New Fontendo 23DSi Lite XL</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://thenounproject.com/icon/gameboy-advanced-752507/">
                                <a>GBA SVG by Andrew Vester from NounProject.com</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://commons.wikimedia.org/wiki/File:Happy_Mac.svg">
                                <a>Happy Mac by NiloGlock</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://commons.wikimedia.org/wiki/File:Tiger-like-x.svg">
                                <a>Tiger-like-x by Althepal</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
        <Footer />
    </>
}
