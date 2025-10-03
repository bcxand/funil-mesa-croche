'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Award, Download, Star, CheckCircle, Clock, Users, Gift, X, Zap, Target, TrendingUp } from 'lucide-react'

interface QuizAnswer {
  questionId: string
  answer: string | string[]
}

interface QuizState {
  currentStep: 'hero' | 'quiz' | 'sales'
  currentQuestion: number
  answers: QuizAnswer[]
  points: number
  badgeUnlocked: boolean
  previewUnlocked: boolean
  showAchievement: boolean
  achievementMessage: string
}

interface PopupData {
  show: boolean
  title: string
  message: string
  type: 'success' | 'info' | 'warning'
}

const QUESTIONS = [
  {
    id: 'q1',
    title: 'Você já trabalha com costura ou algo relacionado a crochê?',
    type: 'single',
    options: [
      { value: 'professional', label: '🤩 Sim, sou costureira profissional', emoji: '🤩' },
      { value: 'hobby', label: '😊 Sim, faço por hobby / complemento de renda', emoji: '😊' },
      { value: 'beginner', label: '😉 Não, mas quero aprender e lucrar!', emoji: '😉' },
      { value: 'learn', label: '😌 Só quero aprender a fazer!', emoji: '😌' }
    ],
    feedback: 'Ótimo — entendido.'
  },
  {
    id: 'q2',
    title: 'Você já fez algum curso sobre mesa posta em crochê?',
    type: 'single',
    options: [
      { value: 'never', label: '🤩 Nunca fiz, esse vai ser o primeiro', emoji: '🤩' },
      { value: 'one', label: '📖 Já fiz um curso', emoji: '📖' },
      { value: 'several', label: '🎓 Já fiz vários cursos', emoji: '🎓' }
    ],
    feedback: 'Perfeito — vamos adaptar o plano pro seu nível.'
  },
  {
    id: 'q3',
    title: 'Quanto tempo por dia você tem pra criar peças?',
    type: 'single',
    options: [
      { value: 'short', label: '🕑 15min–1h', emoji: '🕑' },
      { value: 'medium', label: '🕓 3–4h', emoji: '🕓' },
      { value: 'full', label: '🕙 Tenho o dia todo!', emoji: '🕙' }
    ],
    feedback: 'Anotado — isso ajuda a montar sua rota de vendas.',
    hasPopup: true
  },
  {
    id: 'q4',
    title: 'O que mais te incomoda hoje?',
    type: 'multi',
    options: [
      { value: 'money', label: '😞 Não sobra dinheiro para fazer o que gosto', emoji: '😞' },
      { value: 'time', label: '😰 Falta de tempo pra família', emoji: '😰' },
      { value: 'savings', label: '😭 Não consigo guardar dinheiro', emoji: '😭' }
    ],
    feedback: 'Obrigado por compartilhar — isso será usado para personalizar seu plano.'
  },
  {
    id: 'q5',
    title: 'Quanto você gostaria de ganhar por mês com crochê?',
    type: 'single',
    options: [
      { value: '500', label: '💰 R$ 500 extras', emoji: '💰' },
      { value: '1500', label: '🎯 R$ 1.500 por mês', emoji: '🎯' },
      { value: '3000', label: '🚀 R$ 3.000 ou mais', emoji: '🚀' }
    ],
    feedback: 'Excelente! Sua meta é totalmente realizável.',
    hasPopup: true
  },
  {
    id: 'q6',
    title: 'Depois de criar peças, qual será seu principal objetivo?',
    type: 'single',
    options: [
      { value: 'sell', label: '📈 Aprender a vender e lucrar com mesa posta', emoji: '📈' },
      { value: 'leverage', label: '🥂 Alavancar resultados do meu negócio atual', emoji: '🥂' },
      { value: 'hobby', label: '🎓 Só quero fazer por hobby/prazer', emoji: '🎓' }
    ],
    feedback: 'Ótimo — isso ajusta os módulos sugeridos.'
  },
  {
    id: 'q7',
    title: 'Não precisa ser especialista — com Moldes Prontos + 500 receitas você cria peças rápido.',
    type: 'info',
    subtitle: 'Minha sobrinha de 11 anos fez sua primeira peça em apenas 30 minutos!',
    feedback: ''
  },
  {
    id: 'q8',
    title: 'Escolha seu combo favorito:',
    type: 'visual',
    options: [
      { value: 'combo-a', label: 'Combo Elegante', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
      { value: 'combo-b', label: 'Combo Romântico', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=-50' },
      { value: 'combo-c', label: 'Combo Moderno', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&brightness=1.2' }
    ],
    feedback: 'Preview desbloqueado! Baixe agora ou veja depois.',
    unlockPreview: true,
    hasPopup: true
  },
  {
    id: 'q9',
    title: 'Como você prefere vender suas peças?',
    type: 'single',
    options: [
      { value: 'individual', label: 'Avulsas' },
      { value: 'kits', label: 'Kits (mais lucro)' },
      { value: 'both', label: 'Ambos' }
    ],
    feedback: 'Kits geram ticket médio maior — dica anotada.'
  },
  {
    id: 'q10',
    title: 'Qual seu nível de comprometimento?',
    type: 'slider',
    feedback: 'Comprometimento registrado: {value}% — vamos montar sua rota.',
    hasPopup: true
  }
]

// Sound effects simulation
const playClickSound = () => {
  console.log('🔊 Click sound played')
}

const playProgressSound = () => {
  console.log('🔊 Progress sound played')
}

const playSuccessSound = () => {
  console.log('🔊 Success sound played')
}

export default function FunilCroche() {
  // Reset state on page reload
  useEffect(() => {
    // Clear localStorage on component mount (page reload)
    localStorage.removeItem('croche-quiz-state')
  }, [])

  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 'hero',
    currentQuestion: 0,
    answers: [],
    points: 0,
    badgeUnlocked: false,
    previewUnlocked: false,
    showAchievement: false,
    achievementMessage: ''
  })

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [sliderValue, setSliderValue] = useState(50)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [popup, setPopup] = useState<PopupData>({ show: false, title: '', message: '', type: 'info' })
  
  // Timer states
  const [salesTimer, setSalesTimer] = useState(300) // 5 minutes in seconds
  const [urgencyTimer, setUrgencyTimer] = useState(180) // 3 minutes for urgency
  const [showUrgency, setShowUrgency] = useState(false)

  // Timer effects
  useEffect(() => {
    if (quizState.currentStep === 'sales' && salesTimer > 0) {
      const interval = setInterval(() => {
        setSalesTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizState.currentStep, salesTimer])

  useEffect(() => {
    if (quizState.currentStep === 'sales' && urgencyTimer > 0) {
      const interval = setInterval(() => {
        setUrgencyTimer(prev => {
          if (prev <= 1) {
            setShowUrgency(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizState.currentStep, urgencyTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startQuiz = () => {
    playClickSound()
    setIsTransitioning(true)
    setTimeout(() => {
      setQuizState(prev => ({ ...prev, currentStep: 'quiz' }))
      setIsTransitioning(false)
    }, 300)
  }

  const showAchievement = (message: string) => {
    setQuizState(prev => ({ 
      ...prev, 
      showAchievement: true, 
      achievementMessage: message 
    }))
    setTimeout(() => {
      setQuizState(prev => ({ ...prev, showAchievement: false }))
    }, 3000)
  }

  const showCustomPopup = (questionId: string, answer: string | string[]) => {
    let popupData: PopupData = { show: false, title: '', message: '', type: 'info' }

    switch (questionId) {
      case 'q3': // Time availability
        if (answer === 'short') {
          popupData = {
            show: true,
            title: '⏰ Perfeito para começar!',
            message: 'Com apenas 15min-1h por dia, você pode começar devagar e ir crescendo. Muitas alunas começaram assim e hoje faturam R$ 1.500/mês!',
            type: 'success'
          }
        } else if (answer === 'medium') {
          popupData = {
            show: true,
            title: '🚀 Tempo ideal para crescer!',
            message: 'Com 3-4h por dia, você tem o tempo perfeito para criar peças incríveis e construir uma renda sólida de R$ 2.500/mês!',
            type: 'success'
          }
        } else if (answer === 'full') {
          popupData = {
            show: true,
            title: '💎 Potencial máximo!',
            message: 'Com tempo integral, você pode transformar isso em um negócio de verdade e alcançar R$ 3.500/mês ou mais!',
            type: 'success'
          }
        }
        break

      case 'q5': // Income goal
        if (answer === '500') {
          popupData = {
            show: true,
            title: '🎯 Meta super realista!',
            message: 'Excelente! Sua meta de R$ 500 extras é extremamente realista. Vamos montar um plano para fazer isso em apenas 30 dias!',
            type: 'success'
          }
        } else if (answer === '1500') {
          popupData = {
            show: true,
            title: '💰 Meta perfeita!',
            message: 'Excelente! Sua meta de R$ 1.500 é extremamente realista. Vamos montar um plano para fazer isso em 45 dias!',
            type: 'success'
          }
        } else if (answer === '3000') {
          popupData = {
            show: true,
            title: '🚀 Ambição de empreendedora!',
            message: 'Incrível! Sua meta de R$ 3.000+ mostra que você pensa grande. Vamos montar um plano para alcançar isso em 60 dias!',
            type: 'success'
          }
        }
        break

      case 'q8': // Visual combo choice
        popupData = {
          show: true,
          title: '🎨 Ótima escolha!',
          message: 'Seu gosto refinado vai ajudar muito nas vendas! Clientes adoram peças com esse estilo. Preview especial desbloqueado!',
          type: 'success'
        }
        break

      case 'q10': // Commitment level
        const commitment = typeof answer === 'string' ? parseInt(answer) : 50
        if (commitment >= 80) {
          popupData = {
            show: true,
            title: '🔥 Comprometimento máximo!',
            message: `${commitment}% de comprometimento é incrível! Com essa determinação, você vai alcançar seus objetivos muito mais rápido!`,
            type: 'success'
          }
        } else if (commitment >= 60) {
          popupData = {
            show: true,
            title: '💪 Boa determinação!',
            message: `${commitment}% é um bom nível de comprometimento. Vamos trabalhar juntas para transformar isso em resultados reais!`,
            type: 'info'
          }
        }
        break
    }

    if (popupData.show) {
      setPopup(popupData)
      playSuccessSound()
    }
  }

  const closePopup = () => {
    setPopup({ show: false, title: '', message: '', type: 'info' })
  }

  const nextQuestion = () => {
    const currentQ = QUESTIONS[quizState.currentQuestion]
    let answer: string | string[]

    if (currentQ.type === 'multi') {
      answer = selectedAnswers
      if (selectedAnswers.length === 0) return
    } else if (currentQ.type === 'slider') {
      answer = sliderValue.toString()
    } else if (currentQ.type === 'info') {
      playClickSound()
      setIsTransitioning(true)
      setTimeout(() => {
        if (quizState.currentQuestion < QUESTIONS.length - 1) {
          setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
        } else {
          setQuizState(prev => ({ ...prev, currentStep: 'sales' }))
        }
        setIsTransitioning(false)
      }, 300)
      return
    } else {
      answer = selectedAnswers[0] || ''
      if (!answer) return
    }

    playClickSound()

    // Show custom popup if question has one
    if (currentQ.hasPopup) {
      showCustomPopup(currentQ.id, answer)
    }

    // Calculate points
    let pointsToAdd = 10
    if (currentQ.unlockPreview) {
      pointsToAdd = 20
      setQuizState(prev => ({ ...prev, previewUnlocked: true }))
    }

    // Update answers and points
    const newAnswers = [...quizState.answers]
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQ.id)
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId: currentQ.id, answer }
    } else {
      newAnswers.push({ questionId: currentQ.id, answer })
    }

    const newPoints = quizState.points + pointsToAdd
    const newBadgeUnlocked = newPoints >= 50

    // Show feedback
    let feedback = currentQ.feedback
    if (currentQ.type === 'slider') {
      feedback = feedback.replace('{value}', sliderValue.toString())
    }
    
    setCurrentFeedback(feedback)
    setShowFeedback(true)

    // Check for achievements
    if ((quizState.currentQuestion + 1) % 3 === 0 && quizState.currentQuestion > 0) {
      const achievements = [
        '💡 Você está construindo sua oportunidade!',
        '🎯 Caminho certo para o sucesso!',
        '✨ Quase lá! Seu plano está se formando!'
      ]
      const achievementIndex = Math.floor(quizState.currentQuestion / 3) - 1
      if (achievements[achievementIndex]) {
        setTimeout(() => {
          showAchievement(achievements[achievementIndex])
        }, 1000)
      }
    }

    // Show earning preview at question 8
    if (quizState.currentQuestion === 7) {
      setTimeout(() => {
        const timeAnswer = newAnswers.find(a => a.questionId === 'q3')?.answer
        let estimatedEarning = 'R$ 1.500'
        if (timeAnswer === 'medium') estimatedEarning = 'R$ 2.500'
        if (timeAnswer === 'full') estimatedEarning = 'R$ 3.500'
        
        showAchievement(`💰 Com seu perfil, você já poderia faturar cerca de ${estimatedEarning} por mês`)
      }, 1500)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswers([])
      setSliderValue(50)
      setIsTransitioning(true)

      setTimeout(() => {
        playProgressSound()
        setQuizState(prev => ({
          ...prev,
          answers: newAnswers,
          points: newPoints,
          badgeUnlocked: newBadgeUnlocked,
          currentQuestion: prev.currentQuestion < QUESTIONS.length - 1 ? prev.currentQuestion + 1 : prev.currentQuestion,
          currentStep: prev.currentQuestion >= QUESTIONS.length - 1 ? 'sales' : 'quiz'
        }))
        setIsTransitioning(false)
      }, 300)
    }, 1500)
  }

  const handleSingleChoice = (value: string) => {
    playClickSound()
    setSelectedAnswers([value])
    setTimeout(() => {
      nextQuestion()
    }, 500)
  }

  const handleCheckout = async () => {
    playClickSound()
    const payload = {
      answers: quizState.answers,
      points: quizState.points,
      timestamp: new Date().toISOString()
    }
    
    console.log('Sending to backend:', payload)
    
    const leadId = 'lead_' + Date.now()
    const checkoutUrl = `https://checkout.example.com?lead_id=${leadId}&utm=croche_quiz`
    
    alert(`Redirecionando para checkout: ${checkoutUrl}`)
  }

  const progressPercentage = ((quizState.currentQuestion + 1) / QUESTIONS.length) * 100

  // Get personalized data
  const getPersonalizedData = () => {
    const timeAnswer = quizState.answers.find(a => a.questionId === 'q3')?.answer
    const goalAnswer = quizState.answers.find(a => a.questionId === 'q5')?.answer
    const expAnswer = quizState.answers.find(a => a.questionId === 'q1')?.answer
    
    let targetEarning = 'R$ 3.500'
    let timeCommitment = 'flexível'
    let experienceLevel = 'iniciante'
    let days = '60'
    
    if (goalAnswer === '500') {
      targetEarning = 'R$ 500'
      days = '30'
    } else if (goalAnswer === '1500') {
      targetEarning = 'R$ 1.500'
      days = '45'
    } else if (goalAnswer === '3000') {
      targetEarning = 'R$ 3.000'
      days = '60'
    }
    
    if (timeAnswer === 'short') {
      timeCommitment = '15min-1h por dia'
    } else if (timeAnswer === 'medium') {
      timeCommitment = '3-4h por dia'
    } else if (timeAnswer === 'full') {
      timeCommitment = 'tempo integral'
    }
    
    if (expAnswer === 'professional') experienceLevel = 'profissional'
    else if (expAnswer === 'hobby') experienceLevel = 'intermediário'
    else if (expAnswer === 'beginner') experienceLevel = 'iniciante motivada'
    
    return { targetEarning, timeCommitment, experienceLevel, days }
  }

  if (quizState.currentStep === 'hero') {
    return (
      <div className={`min-h-screen transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} 
           style={{
             background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F7FF 50%, #F0EFFF 100%)',
             backgroundImage: `
               radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(196, 181, 253, 0.15) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
             `
           }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-purple-900 mb-4 leading-tight">
                A VOLTA DA TENDÊNCIA: MESA POSTA DE CROCHÊ que vende MUITO! 🤩
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" 
                      alt="Isadora Melo" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div>
                      <h3 className="font-semibold text-purple-900">Isadora Melo</h3>
                      <p className="text-sm text-purple-700">Especialista em Crochê desde 2023</p>
                    </div>
                  </div>
                  
                  <p className="text-purple-800 leading-relaxed mb-6">
                    Oi, tudo bem? Me chamo Isadora Melo e trabalho com crochê desde 2023.
                    <br /><br />
                    Descobri um jeito <strong>NOVO e SIMPLES</strong> de GANHAR MAIS de <strong className="text-green-700">R$3.500/mês</strong> fazendo peças de crochê para mesa posta — mesmo sem experiência!
                    <br /><br />
                    E o melhor? No final desse questionário eu vou te mostrar o plano personalizado pra você começar.
                  </p>

                  <button
                    onClick={startQuiz}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Quero meu plano — começar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop" 
                  alt="Mesa posta com crochê" 
                  className="w-full rounded-2xl shadow-lg border border-purple-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&sat=-30" 
                    alt="Peças de crochê" 
                    className="w-full rounded-xl shadow-md border border-purple-100"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&brightness=1.1" 
                    alt="Mesa decorada" 
                    className="w-full rounded-xl shadow-md border border-purple-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizState.currentStep === 'quiz') {
    const currentQ = QUESTIONS[quizState.currentQuestion]
    
    return (
      <div className={`min-h-screen transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
           style={{
             background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F7FF 50%, #F0EFFF 100%)',
             backgroundImage: `
               radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(196, 181, 253, 0.15) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
             `
           }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header with Progress - NO BACK BUTTON */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-purple-700">
                    {quizState.currentQuestion + 1} de {QUESTIONS.length}
                  </span>
                  {quizState.badgeUnlocked && (
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs border border-purple-200">
                      <Award className="w-3 h-3" />
                      Pronta para começar
                    </div>
                  )}
                </div>
              </div>

              {/* Crochê-style Progress Bar */}
              <div className="relative w-full bg-purple-100 rounded-full h-4 mb-2 border border-purple-200">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-2 h-full bg-purple-700 rounded-r-full"></div>
                </div>
              </div>
              <p className="text-xs text-purple-600 text-center">
                {quizState.points} pontos • Tecendo seu futuro... 🧶
              </p>
            </div>

            {/* Question Card */}
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
              <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">
                {currentQ.title}
              </h2>

              {currentQ.subtitle && (
                <p className="text-purple-700 text-center mb-6 italic bg-purple-50 p-4 rounded-xl border border-purple-200">
                  {currentQ.subtitle}
                </p>
              )}

              {/* Question Types */}
              {currentQ.type === 'single' && (
                <div className="space-y-3">
                  {currentQ.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSingleChoice(option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-102 ${
                        selectedAnswers.includes(option.value)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-purple-200 hover:border-purple-400 bg-white/50'
                      }`}
                    >
                      <span className="text-lg text-purple-900">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'multi' && (
                <>
                  <div className="space-y-3 mb-6">
                    {currentQ.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          playClickSound()
                          if (selectedAnswers.includes(option.value)) {
                            setSelectedAnswers(selectedAnswers.filter(a => a !== option.value))
                          } else {
                            setSelectedAnswers([...selectedAnswers, option.value])
                          }
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-102 ${
                          selectedAnswers.includes(option.value)
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-purple-200 hover:border-purple-400 bg-white/50'
                        }`}
                      >
                        <span className="text-lg text-purple-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={selectedAnswers.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {currentQ.type === 'visual' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {currentQ.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSingleChoice(option.value)}
                      className={`relative rounded-xl overflow-hidden border-4 transition-all duration-300 hover:scale-105 ${
                        selectedAnswers.includes(option.value)
                          ? 'border-purple-500 scale-105 shadow-lg'
                          : 'border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      <img 
                        src={option.image} 
                        alt={option.label}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent text-white p-2 text-sm font-medium">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'slider' && (
                <>
                  <div className="space-y-6 mb-6">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-purple-600">{sliderValue}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${sliderValue}%, #E9D5FF ${sliderValue}%, #E9D5FF 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-purple-600">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {currentQ.type === 'info' && (
                <>
                  <div className="text-center space-y-6 mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" 
                      alt="Exemplo de peça" 
                      className="w-full max-w-md mx-auto rounded-xl shadow-lg border border-purple-200"
                    />
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Preview Download */}
              {quizState.previewUnlocked && currentQ.unlockPreview && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Preview Desbloqueado!</span>
                  </div>
                  <button className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors">
                    <Download className="w-4 h-4" />
                    Baixar mini-padrão
                  </button>
                </div>
              )}
            </div>

            {/* Feedback Modal */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-purple-200 animate-pulse">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-lg text-purple-800">{currentFeedback}</p>
                </div>
              </div>
            )}

            {/* Achievement Modal */}
            {quizState.showAchievement && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl text-white animate-bounce">
                  <div className="text-4xl mb-4">🎉</div>
                  <p className="text-lg font-semibold">{quizState.achievementMessage}</p>
                </div>
              </div>
            )}

            {/* Custom Popup */}
            {popup.show && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-purple-200 relative">
                  <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {popup.type === 'success' ? '🎉' : popup.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 mb-4">{popup.title}</h3>
                    <p className="text-purple-800 mb-6">{popup.message}</p>
                    <button
                      onClick={closePopup}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Sales Page
  const { targetEarning, timeCommitment, experienceLevel, days } = getPersonalizedData()
  
  return (
    <div className="min-h-screen"
         style={{
           background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F7FF 50%, #F0EFFF 100%)',
           backgroundImage: `
             radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(196, 181, 253, 0.15) 0%, transparent 50%),
             radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
           `
         }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Countdown Timer */}
          <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-bold">Oferta expira em: {formatTime(salesTimer)}</span>
            </div>
          </div>

          {/* Urgency Banner */}
          {showUrgency && (
            <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 text-center animate-bounce">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-bold">⚠️ ÚLTIMAS VAGAS! Apenas 3 vagas restantes com desconto!</span>
                <Zap className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-3xl md:text-5xl font-bold text-purple-900 mb-4 leading-tight">
              Seu Plano Personalizado para Faturar até {targetEarning}/mês com Crochê de Mesa Posta Está Pronto!
            </h1>
            <p className="text-xl text-purple-700 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
              Com base nas suas respostas, esse é o seu plano ideal para começar a faturar em apenas {days} dias
            </p>
          </div>

          {/* What You'll Receive */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">O que Você Vai Receber</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Método Completo Crochê de Mesa Posta: passo a passo para você começar mesmo sem experiência.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Apostilas digitais e gráficos exclusivos para aprender crochê de mesa posta.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Acesso a aulas em vídeo gravadas e práticas para acompanhar no seu ritmo.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Técnicas de precificação para transformar seu trabalho em renda real.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Estratégias de divulgação online para vender rápido e se destacar.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">Grupo de suporte exclusivo para tirar dúvidas e compartilhar resultados.</p>
              </div>
            </div>
          </div>

          {/* Exclusive Bonuses */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 shadow-lg border border-purple-200 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center flex items-center justify-center gap-2">
              <Gift className="w-8 h-8" />
              Bônus Exclusivos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-800"><strong>🎁 Bônus 1</strong> – Catálogo pronto de inspirações para criar suas primeiras peças.</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-800"><strong>🎁 Bônus 2</strong> – Mini curso de fotografia de mesa posta para redes sociais.</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-800"><strong>🎁 Bônus 3</strong> – Planilha de faturamento: organize seus ganhos de forma profissional.</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-800"><strong>🎁 Bônus 4</strong> – Guia de fornecedores de fios e materiais mais baratos.</p>
              </div>
            </div>
          </div>

          {/* About the Teacher */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">Quem é a Professora</h2>
            <div className="flex items-start gap-6">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face" 
                alt="Isadora Melo" 
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
              />
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">👩‍🏫 Isadora Melo</h3>
                <p className="text-purple-800 mb-2">Mais de 3 anos de experiência em crochê e artesanato.</p>
                <p className="text-purple-800 mb-2">Criadora do método Crochê de Mesa Posta que já ajudou dezenas de mulheres a transformar talento em renda.</p>
                <p className="text-purple-800">Reconhecida por sua didática simples e prática, ajudando iniciantes a faturar rapidamente.</p>
              </div>
            </div>
          </div>

          {/* Personalized Testimonial */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">Depoimento Personalizado</h2>
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" 
                alt="Depoimento" 
                className="w-15 h-15 rounded-full object-cover border-2 border-purple-200"
              />
              <div>
                <p className="text-purple-800 italic mb-2">
                  {targetEarning.includes('500') 
                    ? `"Eu também tinha pouco tempo, mas consegui faturar R$ 500 extras no meu primeiro mês trabalhando apenas 1 hora por dia! O método da Isadora é perfeito para quem tem rotina corrida."`
                    : targetEarning.includes('1.500')
                    ? `"Com dedicação de algumas horas por dia, consegui chegar aos R$ 1.500 mensais em apenas 45 dias! As técnicas são muito práticas e funcionam mesmo."`
                    : `"Comecei do zero e em 60 dias já estava faturando R$ 3.000/mês! O método da Isadora é realmente diferente de tudo que já vi."`
                  }
                </p>
                <p className="text-sm text-purple-600">— Maria Silva, Aluna do curso</p>
              </div>
            </div>
          </div>

          {/* Special Offer with Pulsing Effect */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 shadow-lg text-white mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-8 h-8" />
                📦 Oferta Especial – Última Turma com Desconto Exclusivo
              </h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>
                  <p className="text-sm opacity-80 line-through">Valor normal: R$ 197,00</p>
                  <p className="text-4xl font-bold animate-bounce">Valor hoje: R$ 37,00</p>
                </div>
              </div>
              <p className="mb-2 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                ⏰ Desconto válido por apenas {formatTime(salesTimer)}
              </p>
              <p className="mb-6 animate-pulse">🔥 Últimas vagas promocionais!</p>
              
              <button
                onClick={handleCheckout}
                className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg mb-4 animate-pulse"
              >
                👉 Quero pegar meu plano completo por apenas R$ 37
              </button>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">🔒 Garantia Total</h2>
            <p className="text-purple-800 text-lg">
              Garantia de 7 dias: se você não gostar do método, devolvemos 100% do seu investimento.
            </p>
          </div>

          {/* Your Profile Summary */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 text-center flex items-center justify-center gap-2">
              <Target className="w-6 h-6" />
              Seu Perfil Personalizado:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/80 rounded-xl p-4">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-800">Tempo: {timeCommitment}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4">
                <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-800">Nível: {experienceLevel}</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-800">Meta: {targetEarning}/mês em {days} dias</p>
              </div>
            </div>
          </div>

          {/* Floating CTA Button */}
          <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg animate-pulse"
            >
              Garantir por R$ 37 - {formatTime(salesTimer)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}