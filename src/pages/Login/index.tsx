import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom";
import { userStore,tokenStore } from "@/store/createStore.ts";
interface loginParamsInterface {
    email: string;
    password: string;
}
const Login = () => {
    const updateLoginStatus = userStore((state) => state.updateLoginStatus);
    const login = tokenStore((state) => state.login);
    const getUserInfo = userStore((state) => state.getUserInfo);
    const handleOnLogin = async () => {
        const values:loginParamsInterface = form.getValues();
        const res = await login(values);
        if (res) {
            updateLoginStatus(true);
            await getUserInfo();
        }
    }
    const formSchema = z.object({
        email: z.string().min(2, {
            message: "email must be at least 2 characters.",
        }),
        password: z.string().min(2, {
            message: "password must be at least 2 characters.",
        }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password:'',
        },
    })
    return (<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <Form {...form}>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            <Link
                                                href="/forgot-password"
                                                className="ml-auto inline-block text-sm underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full" onClick={handleOnLogin}>
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </Form>
            <div className="hidden bg-muted lg:block">
                <img
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
export default Login;
