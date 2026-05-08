import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function AuthenticatedLayout({ children, showFooter = false }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-dvh bg-surface-50 flex flex-col">
            <Navbar auth={auth} />
            <main className="flex-1">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}
