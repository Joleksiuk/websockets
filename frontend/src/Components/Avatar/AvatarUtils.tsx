import React from 'react'
import { StyledImage } from './Avatar.styled'

export type DiceBearAvatarCategory =
    | 'adventurer'
    | 'adventurer-neutral'
    | 'avataaars'
    | 'avataaars-neutral'
    | 'big-ears'
    | 'big-ears-neutral'
    | 'big-smile'
    | 'bottts'
    | 'bottts-neutral'
    | 'croodles'
    | 'croodles-neutral'
    | 'fun-emoji'
    | 'icons'
    | 'identicon'
    | 'initials'
    | 'lorelei'
    | 'lorelei-neutral'
    | 'micah'
    | 'miniavs'
    | 'notionists'
    | 'notionists-neutral'
    | 'open-peeps'
    | 'personas'
    | 'pixel-art'
    | 'pixel-art-neutral'
    | 'rings'
    | 'shapes'
    | 'thumbs'

export const diceBearAvatarCategories: DiceBearAvatarCategory[] = [
    'adventurer',
    'adventurer-neutral',
    'avataaars',
    'avataaars-neutral',
    'big-ears',
    'big-ears-neutral',
    'big-smile',
    'bottts',
    'bottts-neutral',
    'croodles',
    'croodles-neutral',
    'fun-emoji',
    'icons',
    'identicon',
    'initials',
    'lorelei',
    'lorelei-neutral',
    'micah',
    'miniavs',
    'notionists',
    'notionists-neutral',
    'open-peeps',
    'personas',
    'pixel-art',
    'pixel-art-neutral',
    'rings',
    'shapes',
    'thumbs',
]

const AvatarUtils = {
    getAvatarUrl(seed = '', category = 'identicon'): string {
        return `https://api.dicebear.com/7.x/${category}/svg?seed=${seed}`
    },

    getAvatar(
        seed: string,
        category: DiceBearAvatarCategory = 'fun-emoji',
    ): JSX.Element {
        const source = `https://api.dicebear.com/7.x/${category}/svg?seed=${seed}`
        return <StyledImage src={source} alt="Avatar" radius="10%" />
    },
}

export default AvatarUtils
