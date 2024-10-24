import StartPage from './StartPage'
import { HomepageProvider } from './HomePageProvider'

export default function HomePage() {
    return (
        <HomepageProvider>
            <StartPage />
        </HomepageProvider>
    )
}
