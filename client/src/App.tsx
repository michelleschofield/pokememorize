import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { UserProvider } from './components/UserContext';
import { SignUpForm } from './pages/SignUpForm';
import { SignInForm } from './pages/SignInForm';
import { StudySets } from './pages/StudySets';
import { SpecificSet } from './pages/SpecificSet';
import { CardEditor } from './pages/CardEditor';
import { FlashcardsSelect } from './pages/FlashcardsSelect';
import { NotFound } from './pages/NotFound';
import { Flashcards } from './pages/Flashcards';
import { MatchSelect } from './pages/MatchSelect';
import { Match } from './pages/Match';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="*" element={<NotFound />} />
          <Route index element={<Home />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="sign-in" element={<SignInForm />} />
          <Route path="study-sets" element={<StudySets />} />
          <Route path="study-sets/:studySetId" element={<SpecificSet />} />
          <Route
            path="study-sets/:studySetId/:cardId"
            element={<CardEditor />}
          />
          <Route path="flashcards" element={<FlashcardsSelect />} />
          <Route path="flashcards/:studySetId" element={<Flashcards />} />
          <Route path="match" element={<MatchSelect />} />
          <Route path="match/:studySetId" element={<Match />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
