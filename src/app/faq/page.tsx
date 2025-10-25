
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CreditCard, Mail, Truck, HelpCircle } from 'lucide-react';

const faqData = [
    {
        id: 1,
        question: '¿Cómo puedo realizar el pago de mi compra?',
        icon: <CreditCard className="h-6 w-6 text-primary" />,
        answer: (
            <>
                <p>Trabajamos con la plataforma de pagos de <strong>Mercado Pago</strong> para garantizar una transacción segura y rápida. Al finalizar tu pedido, serás redirigido a su pasarela donde podrás elegir entre varias opciones:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Tarjeta de Crédito y Débito:</strong> Puedes pagar en cuotas sin interés (sujeto a promociones bancarias) o en un solo pago.</li>
                    <li><strong>Dinero en cuenta de Mercado Pago:</strong> Si ya tienes saldo en tu cuenta, puedes usarlo directamente.</li>
                    <li><strong>Efectivo:</strong> Generando un cupón para pagar en puntos de pago cercanos (como Pago Fácil o Rapipago).</li>
                </ul>
                <p>La integración con su API nos permite procesar tu pago de forma instantánea y con todos los protocolos de seguridad necesarios.</p>
            </>
        )
    },
    {
        id: 2,
        question: '¿Cómo puedo reclamar o reportar un problema con mi pedido?',
        icon: <Mail className="h-6 w-6 text-primary" />,
        answer: (
            <>
                <p>Si tu pedido llegó con algún inconveniente (producto faltante, dañado o incorrecto), el proceso más rápido es enviando un <strong>correo electrónico</strong> a nuestra casilla de soporte: <a href="mailto:soporte@moovitech.com" className="text-primary hover:underline">soporte@moovitech.com</a>.</p>
                <p>Para agilizar la solución, te pedimos que incluyas la siguiente información:</p>
                <ol className="list-decimal space-y-2 pl-6">
                    <li><strong>Número de Pedido:</strong> (Fundamental para la identificación).</li>
                    <li><strong>Descripción Detallada:</strong> Explica claramente el problema.</li>
                    <li><strong>Evidencia Fotográfica:</strong> Adjunta fotos del estado del paquete y del producto dañado, si aplica.</li>
                </ol>
                <p>Nuestro equipo revisará tu caso en un plazo máximo de 24 horas hábiles y te ofrecerá una solución, ya sea un reenvío, un cupón de descuento o un reembolso.</p>
            </>
        )
    },
    {
        id: 3,
        question: '¿Cuánto tardará en llegar mi pedido?',
        icon: <Truck className="h-6 w-6 text-primary" />,
        answer: (
            <>
                <p>El tiempo de entrega varía según tu ubicación y el tipo de producto. Generalmente, una vez despachado el paquete, el envío demora entre <strong>3 a 7 días hábiles</strong>.</p>
                <p>Podrás ver el tiempo estimado exacto de entrega al ingresar tu código postal en la página del producto o al finalizar la compra. Una vez que el pedido sea enviado, recibirás un correo con el <strong>número de seguimiento</strong> para monitorear su recorrido en tiempo real.</p>
            </>
        )
    },
];

const FAQPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 pt-32">
            <header className="mb-12 rounded-lg bg-card p-8 text-center shadow-lg">
                <HelpCircle className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Preguntas Frecuentes (FAQ)</h1>
                <p className="mt-4 text-lg text-muted-foreground">Encuentra respuestas rápidas a tus dudas más comunes sobre pagos, pedidos y envíos.</p>
            </header>

            <div className="mx-auto max-w-3xl">
                 <Accordion type="single" collapsible className="w-full">
                    {faqData.map(item => (
                        <AccordionItem value={`item-${item.id}`} key={item.id} className="mb-4 rounded-lg border bg-card shadow-sm">
                            <AccordionTrigger className="flex w-full items-center justify-between p-6 text-left text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-4">
                                    {item.icon}
                                    {item.question}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-invert max-w-none p-6 pt-0 lg:prose-xl">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <footer className="mt-12 border-t pt-8 text-center">
                 <p className="text-muted-foreground">
                    ¿Aún tienes dudas? No hay problema. Contáctanos a través de nuestro <a href="/contact" className="text-primary hover:underline">formulario de Contacto</a>.
                </p>
            </footer>
        </div>
    );
};

export default FAQPage;
