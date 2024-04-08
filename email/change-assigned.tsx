import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import React from "react";

type AssignedChangeProps = {
  assigned: string;
  emailAssigned: string;
  imageAssigned: string;
  emailFrom: string;
  imageFrom: string;
  ticketNumber: string;
  idTicket: string;
};

const ChangeAssigned = ({
  assigned,
  emailAssigned,
  imageAssigned,
  emailFrom,
  imageFrom,
  ticketNumber,
  idTicket,
}: AssignedChangeProps) => {
  return (
    <Html>
      <Head />
      <Preview>New message from administrator</Preview>
      <Tailwind>
        <Body className="bg-white font-sans px-4 py-8">
          <Container className="border border-gray-200 rounded-lg mx-auto p-6 max-w-xl shadow-sm">
            <Section className="mb-6 text-center">
              <Img
                src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/vercel-logo.png"
                width="48"
                height="48"
                alt="Vercel"
                className="inline-block"
              />
            </Section>
            <Heading className="text-black text-2xl font-semibold text-center mb-4">
              Hi <strong>{assigned}</strong> on <strong>Vercel</strong>
            </Heading>
            <Text className="text-black text-base leading-6 mb-4">
              Hello {assigned},
            </Text>
            <Text className="text-black text-base leading-6 mb-6">
              (
              <Link href={"#"} className="text-blue-500 underline">
                {" "}
                {emailAssigned}{" "}
              </Link>
              ) you have been assigned ticket number{" "}
              <strong>{ticketNumber}</strong>.
            </Text>
            <Section className="flex items-center justify-center space-x-4 mb-6">
              <Column className="text-center">
                <Img
                  className="rounded-full border border-gray-200"
                  src={imageFrom}
                  width="64"
                  height="64"
                />
                <Text className="text-base mt-2">From User</Text>{" "}
                {/* Placeholder for actual name */}
                <Text className="text-sm text-gray-500">{emailFrom}</Text>
              </Column>
              <Column className="flex-shrink-0">
                <Img
                  src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/vercel-arrow.png"
                  width="24"
                  height="24"
                  alt="Arrow"
                  className="mx-2"
                />
              </Column>
              <Column className="text-center">
                <Img
                  className="rounded-full border border-gray-200"
                  src={imageAssigned}
                  width="64"
                  height="64"
                />
                <Text className="text-base mt-2">{assigned}</Text>
                <Text className="text-sm text-gray-500">{emailAssigned}</Text>
              </Column>
            </Section>
            <Section className="text-center mb-4">
              <Button
                className="bg-black rounded-md text-white text-sm font-semibold py-3 px-6"
                href={`http://localhost:3000/tickets/${idTicket}`}
              >
                See the ticket
              </Button>
            </Section>
            <Text className="text-black text-base leading-6">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`http://localhost:3000/tickets/${idTicket}`}
                className="text-blue-500 underline"
              >
                http://localhost:3000/tickets/{idTicket}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ChangeAssigned;
