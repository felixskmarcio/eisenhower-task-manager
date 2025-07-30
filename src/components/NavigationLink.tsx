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
    // Só intercepta o clique principal (esquerdo) sem modificadores
    if (
      e.button === 0 && // Clique esquerdo
      !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey && // Sem modificadores
      !(props.target === '_blank')
    ) {
      e.preventDefault();
      if (location.pathname !== to.toString()) {
        setPageTransition(true);
        setTimeout(() => {
          navigate(to.toString());
        }, 50);
      } else {
        navigate(to.toString());
      }
      if (props.onClick) {
        props.onClick(e);
      }
    }
    // Caso contrário, deixa o comportamento padrão (abrir em nova aba, etc)
  };

  return (
    <Link
      to={to}
      className={combinedClassName}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;