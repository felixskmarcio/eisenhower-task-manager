import React, { useEffect } from 'react';
import { Link, LinkProps, useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from '@/contexts/LoadingContext';

interface NavigationLinkProps extends LinkProps {
  showLoadingScreen?: boolean;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  to,
  children,
  showLoadingScreen = false,
  className = '',
  activeClassName = 'active',
  ...props
}) => {
  const { setPageTransition } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se o link está ativo
  const isActive = location.pathname === to.toString();
  const combinedClassName = isActive ? `${className} ${activeClassName}`.trim() : className;

  // Se não queremos mostrar a tela de carregamento, usamos o Link normal
  if (!showLoadingScreen) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  // Se queremos mostrar a tela de carregamento, interceptamos a navegação
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Só ativar o carregamento se estiver navegando para uma rota diferente
    if (location.pathname !== to.toString()) {
      // Ativar a tela de carregamento
      setPageTransition(true);
      
      // Navegar após um pequeno delay para garantir que a tela de carregamento seja exibida
      setTimeout(() => {
        navigate(to.toString());
      }, 50);
    } else {
      // Se já estiver na mesma rota, apenas navega sem mostrar a tela de carregamento
      navigate(to.toString());
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <a
      href={typeof to === 'string' ? to : '#'}
      className={combinedClassName}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default NavigationLink; 