import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|login|not-allowed).*)",
    ],
};

const routesConfig = {
    admin: new Set([
        "/activate-teaching-schedule-registration",
        "/enable-credit-registration",
        "/classroom",
        "/classroom/view",
        "/classroom/create-edit",
        "/faculty",
        "/faculty/view",
        "/faculty/create-edit",
        "/lecturer_management",
        "/lecturer_management/view",
        "/lecturer_management/create-edit",
        "/major",
        "/major/view",
        "/major/create-edit",
        "/profile/view",
        "/profile/edit",
        "/specialization",
        "/specialization/view",
        "/specialization/create-edit",
        "/student_management",
        "/student_management/view",
        "/student_management/create-edit",
        "/subject",
        "/subject/view",
        "/subject/create-edit",
        "/training-program",
        "/training-program/view",
        "/training-program/create-edit",
    ]),
    employee: new Set([
        "/classroom",
        "/classroom/view",
        "/classroom/create-edit",
        "/profile/view",
        "/profile/edit",
    ]),
    lecturer: new Set(["/profile/view", "/profile/edit"]),
    student: new Set(["/profile/view", "/profile/edit"]),
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    const user = {
        role: "admin",
    };

    // Caching user role check in memory or session
    if (user) {
        const userRole = user.role as keyof typeof routesConfig;

        if (routesConfig[userRole]?.has(pathname)) {
            return NextResponse.next();
        } else {
            url.pathname = "/not-allowed";
            return NextResponse.redirect(url);
        }
    } else {
        const publicRoutes = new Set(["/login", "/"]);
        if (!publicRoutes.has(pathname)) {
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
