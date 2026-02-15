'use client';

import { Container, Title, Text, Box, ThemeIcon, rem, SimpleGrid, Paper, Stack, Center } from '@mantine/core';
import { IconSchool, IconCheck } from '@tabler/icons-react';
import { LoginForm } from '@/components/Auth/LoginForm';

export default function Home() {
  return (
    <Box h="100vh" bg="gray.0" style={{ overflow: 'hidden' }}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} h="100%">
        { }
        <Center
          bg="blue.6"
          p="xl"
          visibleFrom="md"
          style={{
            backgroundImage: 'linear-gradient(135deg, var(--mantine-color-blue-7) 0%, var(--mantine-color-cyan-6) 100%)',
          }}
        >
          <Container size="xs">
            <ThemeIcon size={80} radius="xl" variant="white" mb="xl">
              <IconSchool style={{ width: rem(40), height: rem(40), color: 'var(--mantine-color-blue-6)' }} />
            </ThemeIcon>

            <Title order={1} c="white" size="3.5rem" fw={900} mb="lg" style={{ lineHeight: 1.1 }}>
              College ERP <br /> Portal
            </Title>

            <Text c="blue.0" size="xl" mb={40}>
              Automate academics, manage finances, and empower stakeholders with our unified institutional platform.
            </Text>

            <Stack gap="sm">
              {[
                'Single Source of Truth for Data',
                'Real-time Academic Analytics',
                'Seamless Fee & Finance Tracking',
                'Parent-Teacher Communication Bridge'
              ].map((item) => (
                <Box key={item} style={{ display: 'flex', alignItems: 'center' }}>
                  <ThemeIcon size={24} radius="xl" variant="light" color="blue.1" mr="sm">
                    <IconCheck style={{ width: rem(14), height: rem(14) }} />
                  </ThemeIcon>
                  <Text c="white" fw={500}>{item}</Text>
                </Box>
              ))}
            </Stack>
          </Container>
        </Center>

        { }
        <Center p="xl">
          <Container size={420} w="100%">
            <Box mb={40} hiddenFrom="md" ta="center">
              <ThemeIcon size={60} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md">
                <IconSchool style={{ width: rem(30), height: rem(30) }} />
              </ThemeIcon>
              <Title order={2} mb="xs">College ERP</Title>
              <Text c="dimmed">Institute Management Portal</Text>
            </Box>

            <Paper shadow="xl" radius="lg" withBorder p={40}>
              <Title order={2} mb="xs" fw={800}>Portal Login</Title>
              <Text c="dimmed" size="sm" mb={30}>
                Enter your registered ID and password to access your dashboard.
              </Text>

              <LoginForm />

              <Text ta="center" mt="xl" size="xs" c="dimmed">
                Authorized Personnel Only. <br />
                © {new Date().getFullYear()} Institute Name.
              </Text>
            </Paper>
          </Container>
        </Center>
      </SimpleGrid>
    </Box>
  );
}
