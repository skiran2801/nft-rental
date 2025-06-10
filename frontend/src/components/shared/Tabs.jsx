import React from 'react';

export const Tab = ({ children, active }) => {
  return (
    <div className={`${active ? 'block' : 'hidden'}`}>
      {children}
    </div>
  );
};

export const Tabs = ({ children, activeTab, onChange }) => {
  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {React.Children.map(children, (child) => {
            const isActive = child.props.id === activeTab;
            return (
              <button
                key={child.props.id}
                onClick={() => onChange(child.props.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {child.props.label}
              </button>
            );
          })}
        </nav>
      </div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.id === activeTab
        })
      )}
    </div>
  );
}; 